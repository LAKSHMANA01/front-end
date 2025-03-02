import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider, useDispatch } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import AdminHazardsTickets from "./AdminHazardsTickets";
import { HazardsTicket } from "../../redux/Slice/raiseticke";
import { toast } from "react-toastify";

// Define a dummy value for the missing inputStyles variable
global.inputStyles = "dummy-input-styles";

// --- Mock CustomCard so that it simply renders its title and children ---
jest.mock("../../compoents/CustomCard", () => {
  return function MockCustomCard({ title, children }) {
    return (
      <div data-testid="custom-card">
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

// --- Mock HazardsTicket action creator ---
jest.mock("../../redux/Slice/raiseticke", () => ({
  HazardsTicket: jest.fn(),
}));

// --- Mock useNavigate from react-router-dom ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// --- Mock react-toastify's ToastContainer and toast.success ---
jest.mock("react-toastify", () => ({
  ToastContainer: ({ children }) => (
    <div data-testid="toast-container">{children}</div>
  ),
  toast: { success: jest.fn() },
}));

// --- Mock react-redux's useDispatch ---
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

// --- Helper function to create a dummy Redux store ---
const createMockStore = (initialState) => {
  return createStore(() => initialState);
};

// --- Helper function to render with Redux Provider and MemoryRouter ---
const renderWithProviders = (component, store) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>{component}</Provider>
    </MemoryRouter>
  );
};

describe("AdminHazardsTickets Component", () => {
  let mockDispatch;

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch = jest.fn();
    // Instead of using spyOn, we directly set the return value on the mocked useDispatch.
    useDispatch.mockReturnValue(mockDispatch);
    mockNavigate.mockReset();
    toast.success.mockClear();
    HazardsTicket.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders component correctly", () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    // Check that the CustomCard title is rendered
    expect(screen.getByText("Add New Hazards")).toBeInTheDocument();

    // Check for presence of form inputs and buttons
    expect(screen.getByPlaceholderText("Hazard Title")).toBeInTheDocument();
    // There are two inputs with placeholder "Address"
    expect(screen.getAllByPlaceholderText("Address")).toHaveLength(2);
    expect(
      screen.getByPlaceholderText("Describe hazard in detail")
    ).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Hazard/i)).toBeInTheDocument();
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  test("updates form inputs correctly", () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    const hazardTitleInput = screen.getByPlaceholderText("Hazard Title");
    const addressInputs = screen.getAllByPlaceholderText("Address");
    const descriptionInput = screen.getByPlaceholderText(
      "Describe hazard in detail"
    );
    const riskLevelSelect = screen.getByDisplayValue("Medium - Needs Attention");
    // "Enter Pin Code" label is rendered; get its adjacent input
    const pinLabel = screen.getByText("Enter Pin Code");
    const pinCodeInput = pinLabel.nextElementSibling;

    // Change the hazard title input
    fireEvent.change(hazardTitleInput, { target: { value: "Fire" } });
    expect(hazardTitleInput.value).toBe("Fire");

    // Change the first Address input – note this one erroneously updates hazardType
    fireEvent.change(addressInputs[0], { target: { value: "Explosion" } });
    // Because the hazard title input's value is bound to ticketForm.hazardType,
    // its value becomes "Explosion"
    expect(hazardTitleInput.value).toBe("Explosion");

    // Change the second Address input which correctly sets the address field
    fireEvent.change(addressInputs[1], { target: { value: "123 Main St" } });
    expect(addressInputs[1].value).toBe("123 Main St");

    // Change the description textarea
    fireEvent.change(descriptionInput, {
      target: { value: "Test hazard description" },
    });
    expect(descriptionInput.value).toBe("Test hazard description");

    // Change the risk level select
    fireEvent.change(riskLevelSelect, { target: { value: "high" } });
    expect(riskLevelSelect.value).toBe("high");

    // Change the pincode input
    fireEvent.change(pinCodeInput, { target: { value: "12345" } });
    expect(pinCodeInput.value).toBe("12345");
  });

  test("submits form successfully with truthy response", async () => {
    const store = createMockStore({});
    // Simulate dispatch returning a resolved promise with a truthy value
    mockDispatch.mockResolvedValue(true);
    HazardsTicket.mockImplementation((data) => ({
      type: "HAZARD_TICKET",
      payload: data,
    }));

    renderWithProviders(<AdminHazardsTickets />, store);

    const hazardTitleInput = screen.getByPlaceholderText("Hazard Title");
    const addressInputs = screen.getAllByPlaceholderText("Address");
    const descriptionInput = screen.getByPlaceholderText(
      "Describe hazard in detail"
    );
    const riskLevelSelect = screen.getByDisplayValue("Medium - Needs Attention");
    const pinLabel = screen.getByText("Enter Pin Code");
    const pinCodeInput = pinLabel.nextElementSibling;

    // Fill in the form inputs
    fireEvent.change(hazardTitleInput, { target: { value: "Initial Title" } });
    // Change the first Address input (overwrites hazardType)
    fireEvent.change(addressInputs[0], { target: { value: "Overridden Title" } });
    // Change the second Address input to set the actual address field
    fireEvent.change(addressInputs[1], { target: { value: "123 Main St" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test hazard description" },
    });
    fireEvent.change(riskLevelSelect, { target: { value: "high" } });
    fireEvent.change(pinCodeInput, { target: { value: "12345" } });

    // Submit the form by clicking the "Submit Hazard" button
    const submitButton = screen.getByText(/Submit Hazard/i);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Expected formData reflects the fact that the second input overwrote hazardType:
    const expectedFormData = {
      hazardType: "Overridden Title",
      description: "Test hazard description",
      riskLevel: "high",
      address: "123 Main St",
      pincode: "12345",
    };

    expect(mockDispatch).toHaveBeenCalledWith(
      HazardsTicket(expectedFormData)
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Hazard submitted successfully!"
    );

    // Advance timers by 1000ms to trigger delayed navigation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/admin/hazards");

    // Check that the form resets to initial values
    expect(hazardTitleInput.value).toBe("");
    expect(addressInputs[1].value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(riskLevelSelect.value).toBe("medium");
    expect(pinCodeInput.value).toBe("");
  });

  test("submits form with falsey response (no toast or navigation)", async () => {
    const store = createMockStore({});
    mockDispatch.mockResolvedValue(false);
    HazardsTicket.mockImplementation((data) => ({
      type: "HAZARD_TICKET",
      payload: data,
    }));

    renderWithProviders(<AdminHazardsTickets />, store);

    const hazardTitleInput = screen.getByPlaceholderText("Hazard Title");
    const addressInputs = screen.getAllByPlaceholderText("Address");
    const descriptionInput = screen.getByPlaceholderText(
      "Describe hazard in detail"
    );
    const riskLevelSelect = screen.getByDisplayValue("Medium - Needs Attention");
    const pinLabel = screen.getByText("Enter Pin Code");
    const pinCodeInput = pinLabel.nextElementSibling;

    // Fill in the form inputs
    fireEvent.change(hazardTitleInput, { target: { value: "Test Title" } });
    fireEvent.change(addressInputs[0], { target: { value: "Overridden Title" } });
    fireEvent.change(addressInputs[1], { target: { value: "456 Another St" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Another description" },
    });
    fireEvent.change(riskLevelSelect, { target: { value: "low" } });
    fireEvent.change(pinCodeInput, { target: { value: "67890" } });

    // Submit the form
    const submitButton = screen.getByText(/Submit Hazard/i);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const expectedFormData = {
      hazardType: "Overridden Title",
      description: "Another description",
      riskLevel: "low",
      address: "456 Another St",
      pincode: "67890",
    };

    expect(mockDispatch).toHaveBeenCalledWith(
      HazardsTicket(expectedFormData)
    );
    // Because the response is falsey, the success toast should not be triggered
    expect(toast.success).not.toHaveBeenCalledWith(
      "Hazard submitted successfully!"
    );

    // Form resets regardless of response
    expect(hazardTitleInput.value).toBe("");
    expect(addressInputs[1].value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(riskLevelSelect.value).toBe("medium");
    expect(pinCodeInput.value).toBe("");

    // Advance timers by 1000ms; navigation should not occur
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("handles submission error gracefully", async () => {
    const store = createMockStore({});
    const originalConsoleError = console.error;
    console.error = jest.fn();
    mockDispatch.mockRejectedValue(new Error("Submission failed"));
    HazardsTicket.mockImplementation((data) => ({
      type: "HAZARD_TICKET",
      payload: data,
    }));

    renderWithProviders(<AdminHazardsTickets />, store);

    const hazardTitleInput = screen.getByPlaceholderText("Hazard Title");
    const addressInputs = screen.getAllByPlaceholderText("Address");
    const descriptionInput = screen.getByPlaceholderText(
      "Describe hazard in detail"
    );
    const riskLevelSelect = screen.getByDisplayValue("Medium - Needs Attention");
    const pinLabel = screen.getByText("Enter Pin Code");
    const pinCodeInput = pinLabel.nextElementSibling;

    fireEvent.change(hazardTitleInput, { target: { value: "Error Title" } });
    fireEvent.change(addressInputs[0], { target: { value: "Error Overridden" } });
    fireEvent.change(addressInputs[1], { target: { value: "Error Address" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Error description" },
    });
    fireEvent.change(riskLevelSelect, { target: { value: "high" } });
    fireEvent.change(pinCodeInput, { target: { value: "00000" } });

    const submitButton = screen.getByText(/Submit Hazard/i);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const expectedFormData = {
      hazardType: "Error Overridden",
      description: "Error description",
      riskLevel: "high",
      address: "Error Address",
      pincode: "00000",
    };

    expect(mockDispatch).toHaveBeenCalledWith(
      HazardsTicket(expectedFormData)
    );
    // Verify that console.error was called with the error message
    expect(console.error).toHaveBeenCalledWith("Failed to submit Hazard:");
    // Restore original console.error
    console.error = originalConsoleError;
  });

  test("handles cancel button correctly", () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    // Check that toast.success is called with "Cancelled!"
    expect(toast.success).toHaveBeenCalledWith("Cancelled!");

    // Advance timers by 1000ms to trigger delayed navigation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/admin/hazards");
  });

  
});