import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import TicketForm from "./HazardsTicket";
import { HazardsTicket } from "../../redux/Slice/raiseticke";
import "react-toastify/dist/ReactToastify.css";

// Mock the lucide-react components
jest.mock("lucide-react", () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Send: () => <div data-testid="send-icon" />,
}));

// Mock the CustomCard component
jest.mock("./CustomCard", () => ({ title, icon: Icon, children }) => (
  <div data-testid="custom-card">
    <h2>{title}</h2>
    <div data-testid="icon">{Icon && <Icon />}</div>
    {children}
  </div>
));

// Mock Redux Actions
jest.mock("../../redux/Slice/raiseticke", () => ({
  HazardsTicket: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockStore = configureStore([]);

describe("TicketForm Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({ Raisetickets: [] });
    
    jest.clearAllMocks();
    
    // Setup basic mock implementation for HazardsTicket
    HazardsTicket.mockReturnValue(() => Promise.resolve({}));
  });

  test("renders TicketForm component correctly", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Add New Hazards")).toBeInTheDocument();
    expect(screen.getByLabelText(/Hazards Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter Pincode/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority Level/i)).toBeInTheDocument();
    expect(screen.getByText("Submit Hazards")).toBeInTheDocument();
    expect(screen.getByText("Cancel Hazards")).toBeInTheDocument();
  });

  test("user can type into the input fields", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );

    const hazardTypeInput = screen.getByLabelText(/Hazards Type/i);
    fireEvent.change(hazardTypeInput, { target: { value: "Gas Leak" } });
    expect(hazardTypeInput.value).toBe("Gas Leak");

    const addressInput = screen.getByLabelText(/Address/i);
    fireEvent.change(addressInput, { target: { value: "123 Main Street" } });
    expect(addressInput.value).toBe("123 Main Street");

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: "There is a suspected gas leak" } });
    expect(descriptionInput.value).toBe("There is a suspected gas leak");

    const pincodeInput = screen.getByLabelText(/Enter Pincode/i);
    fireEvent.change(pincodeInput, { target: { value: "12345" } });
    expect(pincodeInput.value).toBe("12345");
    
    // Find the select element by querying it directly
    const prioritySelect = screen.getByRole('combobox');
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    expect(prioritySelect.value).toBe("high");
  });

  test("clicking Cancel Hazards button navigates back to hazards page", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Cancel Hazards"));

    expect(mockNavigate).toHaveBeenCalledWith("/engineer/Hazards");
  });

  test("form submission dispatches HazardsTicket action", async () => {
    // Setup mock to match component expectations
    const mockDispatch = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({})
    });
    store.dispatch = mockDispatch;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Hazards Type/i), { target: { value: "Gas Leak" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test description" } });
    
    // Submit form
    fireEvent.click(screen.getByText("Submit Hazards"));
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(HazardsTicket).toHaveBeenCalled();
    });
  });

  test("successful form submission shows success toast", async () => {
    const { toast } = require("react-toastify");
    
    // Setup mock
    const mockDispatch = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({})
    });
    store.dispatch = mockDispatch;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Hazards Type/i), { target: { value: "Gas Leak" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test description" } });
    
    // Submit form
    fireEvent.click(screen.getByText("Submit Hazards"));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Ticket submitted successfully!");
    });
  });

  test("failed form submission shows error toast", async () => {
    const { toast } = require("react-toastify");
    
    // Setup mock with rejection
    const mockDispatch = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error("API Error"))
    });
    store.dispatch = mockDispatch;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Hazards Type/i), { target: { value: "Gas Leak" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test description" } });
    
    // Submit form
    fireEvent.click(screen.getByText("Submit Hazards"));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to submit ticket. Try again.");
    });
  });

  test("form resets fields after successful submission", async () => {
    // Setup mock
    const mockDispatch = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({})
    });
    store.dispatch = mockDispatch;
    
    // Use fake timers
    jest.useFakeTimers();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TicketForm />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill in form fields
    const hazardTypeInput = screen.getByLabelText(/Hazards Type/i);
    fireEvent.change(hazardTypeInput, { target: { value: "Gas Leak" } });
    
    const addressInput = screen.getByLabelText(/Address/i);
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    
    const pincodeInput = screen.getByLabelText(/Enter Pincode/i);
    fireEvent.change(pincodeInput, { target: { value: "12345" } });
    
    // Submit form
    fireEvent.click(screen.getByText("Submit Hazards"));
    
    // Wait for async operations
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    // Check form reset
    expect(hazardTypeInput.value).toBe("");
    expect(addressInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(pincodeInput.value).toBe("");
    
    // Advance timers to trigger navigation
    jest.advanceTimersByTime(1000);
    
    expect(mockNavigate).toHaveBeenCalledWith("/engineer/Hazards");
    
    jest.useRealTimers();
  });
});