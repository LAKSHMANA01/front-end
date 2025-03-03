// UserProfile.test.jsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserProfile from "./UserProfile";
import { fetchProfile, fetchUpdateProfile } from "../../redux/Slice/UserSlice";
import { validateEmail, validatePhoneNumber } from "../../utils/validation";

// --- Set sessionStorage items for testing ---
beforeAll(() => {
  sessionStorage.setItem("email", "john.doe@example.com");
  sessionStorage.setItem("role", "user");
});
afterAll(() => {
  sessionStorage.clear();
});

// --- Mock Footer so it returns a simple element ---
jest.mock("../../compoents/footers", () => () => <div>Footer Component</div>);

// --- Mock validation functions ---
jest.mock("../../utils/validation", () => ({
  validateEmail: jest.fn(),
  validatePhoneNumber: jest.fn(),
}));

// --- Mock fetchProfile and fetchUpdateProfile actions ---
jest.mock("../../redux/Slice/UserSlice", () => ({
  fetchProfile: jest.fn(),
  fetchUpdateProfile: jest.fn(),
}));

// Create a redux-mock-store
const mockStore = configureStore([]);

describe("UserProfile Component", () => {
  let store;
  let initialState;

  beforeEach(() => {
    jest.useFakeTimers();
    // Clear mocks
    fetchProfile.mockClear();
    fetchUpdateProfile.mockClear();
    validateEmail.mockClear();
    validatePhoneNumber.mockClear();

    // By default, assume validations pass.
    validateEmail.mockReturnValue(true);
    validatePhoneNumber.mockReturnValue(true);

    // Default state: profile already loaded.
    initialState = {
      tickets: {
        profile: {
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          address: "123 Main St",
        },
        loading: false,
        error: null,
        success: false,
      },
    };
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders user profile in personal tab", () => {
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    // Check header and profile fields in the default "personal" tab.
    expect(screen.getByText("Your Profile")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();

    // Verify that the footer is rendered.
    expect(screen.getByText("Footer Component")).toBeInTheDocument();
  });

  test("calls fetchProfile if profile is not loaded", () => {
    // Provide state with empty profile.
    initialState = {
      tickets: { profile: {} },
    };
    store = mockStore(initialState);
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    // Since profile.email is falsy, the useEffect should dispatch fetchProfile.
    expect(fetchProfile).toHaveBeenCalledWith({
      userEmail: sessionStorage.getItem("email"),
      role: sessionStorage.getItem("role"),
    });
  });

  test("updates profile info on update tab with valid data", async () => {
    // Simulate successful update: dispatch resolves with payload.success true.
    fetchUpdateProfile.mockImplementation((data) => ({
      type: "fetchUpdateProfile",
      payload: { success: true, ...data },
    }));

    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    // Switch to "Update Profile" tab.
    fireEvent.click(screen.getByText("Update Profile"));

    // Get all textboxes in the update form.
    const inputs = screen.getAllByRole("textbox");
    // Order: 0: Full Name, 1: Email, 2: Phone, 3: Address
    const fullNameInput = inputs[0];
    const emailInput = inputs[1];
    const phoneInput = inputs[2];
    const addressInput = inputs[3];

    // Change the full name.
    fireEvent.change(fullNameInput, { target: { value: "Jane Doe" } });
    // Leave others unchanged.

    // Submit the form.
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expected payload contains updated full name; others remain as in profile.
    expect(fetchUpdateProfile).toHaveBeenCalledWith({
      userEmail: sessionStorage.getItem("email"),
      role: sessionStorage.getItem("role"),
      updatedata: {
        name: "Jane Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Main St",
      },
    });

    // The button text should now indicate success.
    expect(
      screen.getByRole("button", { name: /profile updated!/i })
    ).toBeInTheDocument();

    // After 3 seconds the success indicator resets.
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when email or phone is invalid", async () => {
    // Make validation functions return false.
    validateEmail.mockReturnValue(false);
    validatePhoneNumber.mockReturnValue(false);

    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    // Switch to update tab.
    fireEvent.click(screen.getByText("Update Profile"));

    // Get all textboxes; 1 is email and 2 is phone.
    const inputs = screen.getAllByRole("textbox");
    const emailInput = inputs[1];
    const phoneInput = inputs[2];

    // Enter invalid email and phone.
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(phoneInput, { target: { value: "abc" } });

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expect error messages to appear.
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();

    // The update action should not be dispatched.
    expect(fetchUpdateProfile).not.toHaveBeenCalled();
  });

  test("handles error on update dispatch gracefully", async () => {
    // Simulate a failure when dispatching update.
    const error = new Error("Update failed");
    fetchUpdateProfile.mockImplementation(() => Promise.reject(error));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    // Switch to update tab.
    fireEvent.click(screen.getByText("Update Profile"));

    // Get all textboxes; 0 is Full Name.
    const inputs = screen.getAllByRole("textbox");
    const fullNameInput = inputs[0];
    fireEvent.change(fullNameInput, { target: { value: "Error Name" } });

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(fetchUpdateProfile).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Profile update failed:", error.message);

    consoleErrorSpy.mockRestore();
  });
});