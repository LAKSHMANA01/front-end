import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import apiClientUser from "../../utils/apiClientUser";
import { toast } from "react-toastify";
import {
  validateEmail,
  validatePassword,
  validatePincode,
  validatePhoneNumber,
  validateSecurityAnswer,
} from "../../utils/validation";

// Mock API and Dependencies
jest.mock("../../utils/apiClientUser");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: jest.fn(() => <div data-testid="toast-container" />),
}));

// Mock Navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Validation
jest.mock("../../utils/validation", () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
  validatePincode: jest.fn(),
  validatePhoneNumber: jest.fn(),
  validateSecurityAnswer: jest.fn(),
}));

const renderSignupComponent = () => {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateEmail.mockReturnValue(true);
    validatePassword.mockReturnValue(true);
    validatePincode.mockReturnValue(true);
    validatePhoneNumber.mockReturnValue(true);
    validateSecurityAnswer.mockReturnValue(true);
  });

  test("renders signup form correctly", () => {
    renderSignupComponent();
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("validates email field correctly", () => {
    renderSignupComponent();
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    
    // Invalid email
    validateEmail.mockReturnValue(false);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    
    // Valid email
    validateEmail.mockReturnValue(true);
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument();
  });

  test("toggles engineer fields when role changes", () => {
    renderSignupComponent();
    const roleSelect = screen.getByLabelText(/role/i);
    
    // Initially engineer fields should not be visible
    expect(screen.queryByLabelText(/specialization/i)).not.toBeInTheDocument();
    
    // Select engineer role
    fireEvent.change(roleSelect, { target: { value: "engineer" } });
    
    // Engineer fields should now be visible
    expect(screen.getByLabelText(/specialization/i)).toBeInTheDocument();
    expect(screen.getByText(/availability/i)).toBeInTheDocument();
    
    // Change role back to user
    fireEvent.change(roleSelect, { target: { value: "user" } });
    
    // Engineer fields should be hidden again
    expect(screen.queryByLabelText(/specialization/i)).not.toBeInTheDocument();
  });

  test("handles availability checkbox changes correctly", () => {
    renderSignupComponent();
    
    // Select engineer role to see availability checkboxes
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "engineer" } });

    // Get Monday checkbox
    const mondayCheckbox = screen.getByLabelText(/monday/i);
    
    // Check initial state (unchecked)
    expect(mondayCheckbox.checked).toBe(false);
    
    // Click to check
    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox.checked).toBe(true);
    
    // Click to uncheck
    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox.checked).toBe(false);
  });

  // test("submits form with valid data and navigates", async () => {
  //   apiClientUser.post.mockResolvedValue({ data: { success: true } });
  //   renderSignupComponent();

  //   fireEvent.change(screen.getByPlaceholderText(/enter name/i), { target: { value: "Test User" } });
  //   fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: "test@example.com" } });
  //   fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: "Password123!" } });

  //   // Select a role
  //   fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "user" } });

  //   fireEvent.click(screen.getByRole("button", { name: /register/i }));

  //   await waitFor(() => {
  //     expect(apiClientUser.post).toHaveBeenCalledTimes(1);
  //     expect(toast.success).toHaveBeenCalledWith("Registration successful! Please log in.");
  //   });

  //   jest.advanceTimersByTime(5000);
  //   expect(mockNavigate).toHaveBeenCalledWith("/login");
  // });

  // test("handles API error on signup", async () => {
  //   apiClientUser.post.mockRejectedValue({ response: { data: { message: "Signup failed. Please try again." } } });
  //   renderSignupComponent();
    
  //   fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: "test@example.com" } });

  //   // Select a role
  //   fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "user" } });

  //   fireEvent.click(screen.getByRole("button", { name: /register/i }));

  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith("Signup failed. Please try again.");
  //   });
  // });
  test("submits form with valid data and navigates", async () => {
    apiClientUser.post.mockResolvedValue({ data: { success: true } });
    renderSignupComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: "Password123!" } });

    // Select a role
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "user" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(apiClientUser.post).toHaveBeenCalledTimes(1);
      expect(apiClientUser.post).toHaveBeenCalledWith("/users/newUser", expect.objectContaining({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        role: "user",
      }));
      expect(toast.success).toHaveBeenCalledWith("Registration successful! Please log in.");
    });

    jest.advanceTimersByTime(5000);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("handles API error on signup", async () => {
    apiClientUser.post.mockRejectedValue({ response: { data: { message: "Signup failed. Please try again." } } });
    renderSignupComponent();

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: "test@example.com" } });

    // Select a role
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "user" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Signup failed. Please try again.");
    });
  });
});
