import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from "@testing-library/react";
import EngineerProfile from "./EngineerProfile";
import { useDispatch, useSelector } from "react-redux";

// Mock the Navbar (child component) so we don’t need to render its internals.
jest.mock("./Navbar", () => () => <div data-testid="engineer-navbar" />);

// Setup mocks for react-redux hooks.
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Sample profile to use in tests.
const sampleProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  address: "123 Main St",
  availability: ["Monday", "Friday"],
  specialization: "Fault",
};

describe("EngineerProfile", () => {
  beforeEach(() => {
    // Set sessionStorage items used in the component.
    sessionStorage.setItem("email", "john.doe@example.com");
    sessionStorage.setItem("role", "engineer");

    // Reset dispatch mock
    mockDispatch.mockReset();
    useDispatch.mockReturnValue(mockDispatch);
    // By default, simulate that profile is not present (to trigger fetchProfile).
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ tickets: {} })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("dispatches fetchProfile if profile is not loaded", () => {
    render(<EngineerProfile />);
    // Since profile is not present in state, the useEffect should trigger dispatch(fetchProfile(...))
    expect(mockDispatch).toHaveBeenCalled();
  });

  test("renders Navbar and title, and displays personal tab fields when profile exists", async () => {
    // Simulate that profile exists in redux state.
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ tickets: { profile: sampleProfile } })
    );

    render(<EngineerProfile />);
    // Navbar should render.
    expect(screen.getByTestId("engineer-navbar")).toBeInTheDocument();
    // Title should be visible.
    expect(
      screen.getByRole("heading", { name: /Your Profile/i })
    ).toBeInTheDocument();

    // Personal tab is default. Check that fields are shown.
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    // Check that availability checkboxes are rendered (disabled)
    sampleProfile.availability.forEach((day) => {
      // Since availability is computed from profile.availability array,
      // the corresponding checkbox should be checked.
      const checkbox = screen.getAllByRole("checkbox", { checked: true }).find((cb) =>
        cb.nextSibling.textContent === day
      );
      expect(checkbox).toBeInTheDocument();
    });

    // Specialization: since sampleProfile.specialization is "Fault",
    // the radio button for Fault should be checked and disabled.
    const faultRadio = screen.getAllByRole("radio", { checked: true }).find((radio) =>
      radio.value === "Fault"
    );
    expect(faultRadio).toBeInTheDocument();
  });


  test("updates availability checkbox in update form", () => {
    // Provide a profile with default availability.
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ tickets: { profile: sampleProfile } })
    );
    render(<EngineerProfile />);
    // Switch to Update tab.
    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));

    // Find a checkbox for a day that is initially unchecked.
    // From sampleProfile, availability is ["Monday", "Friday"], so Tuesday should be false.
    const tuesdayCheckbox = screen.getAllByRole("checkbox").find(
      (cb) => cb.nextSibling.textContent === "Tuesday"
    );
    expect(tuesdayCheckbox.checked).toBe(false);
    // Click to toggle Tuesday.
    fireEvent.click(tuesdayCheckbox);
    // Now it should be checked.
    expect(tuesdayCheckbox.checked).toBe(true);
  });

  test("updates specialization radio button in update form", () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ tickets: { profile: sampleProfile } })
    );
    render(<EngineerProfile />);
    // Switch to Update tab.
    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));

    // Initially, sampleProfile.specialization is "Fault".
    const installationRadio = screen.getByRole("radio", {
      name: /Installation/i,
    });
    expect(installationRadio.checked).toBe(false);
    // Click the Installation radio.
    fireEvent.click(installationRadio);
    expect(installationRadio.checked).toBe(true);
  });

  test("handles update form submission error", async () => {
    // Spy on console.error to catch the error log.
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Simulate profile present.
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({ tickets: { profile: sampleProfile } })
    );
    // Simulate dispatch failure for update.
    mockDispatch.mockRejectedValue(new Error("Update failed"));

    render(<EngineerProfile />);
    // Switch to Update tab.
    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));

    // Submit the form without any changes.
    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.submit(submitButton.closest("form"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      // Check that error was logged.
      expect(consoleSpy).toHaveBeenCalledWith(
        "Profile update failed:",
        "Update failed"
      );
    });
    consoleSpy.mockRestore();
  });
});