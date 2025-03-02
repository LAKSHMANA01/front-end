import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Create all the mocks before importing the component
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockSelector = jest.fn();

// Mock the entire react-redux module
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockSelector()
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

// Mock the HazardsTicket action creator
jest.mock("../../redux/Slice/raiseticke", () => ({
  HazardsTicket: jest.fn(data => data)
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock the CustomCard component
jest.mock("../../compoents/CustomCard", () => ({
  __esModule: true,
  default: ({ children, title }) => (
    <div data-testid="custom-card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}));

// Now import the component after all mocks are set up
import TicketForm from "./HazardsTicket";
import { HazardsTicket } from "../../redux/Slice/raiseticke";
import { toast } from "react-toastify";

describe("TicketForm Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up default mock behavior
    mockSelector.mockReturnValue({ loading: false, error: null });
    mockDispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ success: true }) });
  });
  
  // Helper function to render the component
  const renderComponent = () => render(<TicketForm />);
  
  test("renders the form correctly", () => {
    renderComponent();
    
    // Check for key form elements
    expect(screen.getByTestId("custom-card")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Hazard Type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe your issue/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });
  
  test("updates form fields when user types", () => {
    renderComponent();
    
    // Get input elements
    const hazardTypeInput = screen.getByPlaceholderText(/Enter Hazard Type/i);
    const addressInput = screen.getByPlaceholderText(/Address/i);
    
    // Change input values
    fireEvent.change(hazardTypeInput, { target: { value: "Electrical" } });
    fireEvent.change(addressInput, { target: { value: "123 Test St" } });
    
    // Check if values were updated
    expect(hazardTypeInput.value).toBe("Electrical");
    expect(addressInput.value).toBe("123 Test St");
  });
  
  test("dispatches HazardsTicket when form is submitted", async () => {
    renderComponent();
    
    // Fill in required form fields
    fireEvent.change(screen.getByPlaceholderText(/Enter Hazard Type/i), { target: { value: "Electrical" } });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: "123 Test St" } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { value: "Test description" } });
    
    // Submit the form
    const form = screen.getByPlaceholderText(/Enter Hazard Type/i).closest("form");
    fireEvent.submit(form);
    
    // Check if the action was dispatched
    expect(mockDispatch).toHaveBeenCalled();
    expect(HazardsTicket).toHaveBeenCalledWith({
      hazardType: "Electrical",
      description: "Test description",
      riskLevel: "medium", // Default value
      address: "123 Test St",
      pincode: ""
    });
  });
  
  test("shows success toast and resets form on successful submission", async () => {
    // Setup the unwrap mock to resolve successfully
    const unwrapMock = jest.fn().mockResolvedValue({ success: true });
    mockDispatch.mockReturnValue({ unwrap: unwrapMock });
    
    renderComponent();
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/Enter Hazard Type/i), { target: { value: "Electrical" } });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: "123 Test St" } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { value: "Test description" } });
    
    const form = screen.getByPlaceholderText(/Enter Hazard Type/i).closest("form");
    fireEvent.submit(form);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(unwrapMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Ticket submitted successfully!");
    });
    
    // Check form reset
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Hazard Type/i).value).toBe("");
      expect(screen.getByPlaceholderText(/Address/i).value).toBe("");
      expect(screen.getByPlaceholderText(/Describe your issue/i).value).toBe("");
    });
  });
  
  test("shows error toast on submission failure", async () => {
    // Setup the unwrap mock to reject
    const unwrapMock = jest.fn().mockRejectedValue(new Error("Submission failed"));
    mockDispatch.mockReturnValue({ unwrap: unwrapMock });
    
    renderComponent();
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/Enter Hazard Type/i), { target: { value: "Electrical" } });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: "123 Test St" } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { value: "Test description" } });
    
    const form = screen.getByPlaceholderText(/Enter Hazard Type/i).closest("form");
    fireEvent.submit(form);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(unwrapMock).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Failed to submit ticket. Try again.");
    });
  });
  
  test("navigates to Hazards page when Cancel button is clicked", () => {
    renderComponent();
    
    // Click the Cancel button
    fireEvent.click(screen.getByText(/Cancel/i));
    
    // Check if navigate was called
    expect(mockNavigate).toHaveBeenCalledWith("/engineer/Hazards");
  });
  
  test("navigates to Hazards page after successful submission", async () => {
    // Mock timers
    jest.useFakeTimers();
    
    // Setup successful submission
    const unwrapMock = jest.fn().mockResolvedValue({ success: true });
    mockDispatch.mockReturnValue({ unwrap: unwrapMock });
    
    renderComponent();
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/Enter Hazard Type/i), { target: { value: "Electrical" } });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: "123 Test St" } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your issue/i), { target: { value: "Test description" } });
    
    const form = screen.getByPlaceholderText(/Enter Hazard Type/i).closest("form");
    fireEvent.submit(form);
    
    // Wait for success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
    
    // Advance timers for the navigation timeout
    jest.advanceTimersByTime(1000);
    
    // Check if navigate was called
    expect(mockNavigate).toHaveBeenCalledWith("/engineer/Hazards");
    
    // Restore real timers
    jest.useRealTimers();
  });
  
  test("validates required fields", async () => {
    renderComponent();
    
    // Try to submit without filling required fields
    const form = screen.getByText(/Submit/i).closest("form");
    fireEvent.submit(form);
    
    // The dispatch should not be called if validation fails
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Fill only some required fields
    fireEvent.change(screen.getByPlaceholderText(/Enter Hazard Type/i), { target: { value: "Electrical" } });
    fireEvent.submit(form);
    
    // Dispatch still should not be called
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});