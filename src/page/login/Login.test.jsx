import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import apiClientUser from "../../utils/apiClientUser";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/validation";

// Mock dependencies
jest.mock("../../utils/apiClientUser");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: jest.fn(() => <div data-testid="toast-container" />),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../utils/validation", () => ({
  validateEmail: jest.fn(),
}));

const renderLoginComponent = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateEmail.mockImplementation(() => true); // Only mocking email validation

    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders login form correctly", () => {
    renderLoginComponent();
    
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("validates email input correctly", () => {
    renderLoginComponent();
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    
    validateEmail.mockImplementation(() => false);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();

    validateEmail.mockImplementation(() => true);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument();
  });

  test("accepts password input without validation", () => {
    renderLoginComponent();
    
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    
    fireEvent.change(passwordInput, { target: { value: "any-password" } });
    expect(passwordInput.value).toBe("any-password");
  });

  test("disables submit button when there is an email validation error", () => {
    renderLoginComponent();
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    validateEmail.mockImplementation(() => false);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    expect(submitButton).toBeDisabled();
  });

  test("shows toast error when submitting with validation errors", async () => {
    renderLoginComponent();
    
    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please fix the validation errors before submitting.");
    });
  });

  test("submits form with valid credentials and navigates", async () => {
    apiClientUser.post.mockResolvedValue({
      data: {
        success: true,
        user: {
          token: "test-token",
          email: "test@example.com",
          role: "user",
        },
      },
    });

    renderLoginComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "AnyPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(apiClientUser.post).toHaveBeenCalledWith("/users/checkUser", {
        email: "test@example.com",
        password: "AnyPassword123!",
      });
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith("token", "test-token");
      expect(mockNavigate).toHaveBeenCalledWith("/user");
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
    });
  });

  test("handles unsuccessful login with server error message", async () => {
    apiClientUser.post.mockResolvedValue({ data: { success: false, error: "Invalid credentials" } });

    renderLoginComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "WrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("shows error when API request fails", async () => {
    apiClientUser.post.mockRejectedValue(new Error("Network Error"));

    renderLoginComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
  });
});
