import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import apiClient from "../../utils/apiClient";
import { ToastContainer, toast } from "react-toastify";

// Mock the react-toastify toast functions
jest.mock("react-toastify", () => {
  const actual = jest.requireActual("react-toastify");
  return {
    ...actual,
    toast: {
      error: jest.fn(),
      success: jest.fn(),
    },
    ToastContainer: () => <div data-testid="toast-container" />,
  };
});

// Mock the navigate function
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock the API client
jest.mock("../../utils/apiClient", () => ({
  post: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );
    
    // More specific queries to avoid duplicate matches
    expect(screen.getByRole("heading", { level: 2, name: /Login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("displays an error message when login fails", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid email or password" } },
    });

    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for the API call to be made
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/users/login", {
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    // Check that toast.error was called with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
    });
  });

  test("redirects to dashboard on successful login", async () => {
    const mockResponse = {
      data: {
        success: true,
        token: "mock-token",
        email: "user@example.com",
        role: "admin",
      },
    };
    apiClient.post.mockResolvedValueOnce(mockResponse);

    const mockNavigate = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/users/login", {
        email: "user@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(sessionStorage.getItem("token")).toBe("mock-token");
      expect(sessionStorage.getItem("email")).toBe("user@example.com");
      expect(sessionStorage.getItem("role")).toBe("admin");
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("validates form inputs before submission", async () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    // Try to submit with empty fields
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check that validation errors are displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter both email and password");
    });

    // API should not be called
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test("handles network errors during login", async () => {
    apiClient.post.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Login failed. Please try again later.");
    });
  });
});