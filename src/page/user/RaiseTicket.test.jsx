import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import TicketForm from "./RaiseTicket";
import ticketReducer, { submitTicket } from "../../redux/Slice/raiseticke";
import { sendNotification } from "../../redux/Slice/notificationSlice";

jest.mock("../../redux/Slice/raiseticke", () => ({
  submitTicket: jest.fn(),
}));

jest.mock("../../redux/Slice/notificationSlice", () => ({
  sendNotification: jest.fn(),
}));

const setupStore = (initialState) =>
  configureStore({
    reducer: {
      tickets: ticketReducer,
      auth: (state = initialState.auth) => state,
    },
    preloadedState: initialState,
  });

describe("TicketForm Component", () => {
  let store;

  beforeEach(() => {
    store = setupStore({
      tickets: { isLoading: false, data: [], isError: false, errorMessage: "" },
      auth: { user: { email: "test@example.com" } },
    });
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("token", "testToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders TicketForm component", () => {
    render(
      <Provider store={store}>
        <TicketForm />
      </Provider>
    );
    expect(screen.getByText(/Raise New Ticket/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Ticket/i)).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(
      <Provider store={store}>
        <TicketForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe your issue or request in detail"),
      { target: { value: "Issue description" } }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter pincode"), {
      target: { value: "123456" },
    });

    expect(screen.getByPlaceholderText("Address").value).toBe("123 Test Street");
    expect(
      screen.getByPlaceholderText("Describe your issue or request in detail").value
    ).toBe("Issue description");
    expect(screen.getByPlaceholderText("Enter pincode").value).toBe("123456");
  });

  it("displays an error if email is not found in sessionStorage", async () => {
    sessionStorage.removeItem("email");

    render(
      <Provider store={store}>
        <TicketForm />
        <ToastContainer />
      </Provider>
    );

    fireEvent.submit(screen.getByText(/Submit Ticket/i));

    await waitFor(() => {
      expect(screen.getByText(/User email not found!/i)).toBeInTheDocument();
    });
  });

  it("submits the ticket successfully and sends a notification", async () => {
    const mockTicket = {
      _id: "123",
      userEmail: "test@example.com",
      engineerEmail: "engineer@example.com",
    };

    submitTicket.mockResolvedValue({
      type: "tickets/submitTicket/fulfilled",
      payload: mockTicket,
    });

    render(
      <Provider store={store}>
        <TicketForm />
        <ToastContainer />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe your issue or request in detail"),
      { target: { value: "Issue description" } }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter pincode"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByText(/Submit Ticket/i));

    await waitFor(() => {
      expect(submitTicket).toHaveBeenCalledWith(expect.any(Object));
    });

    await waitFor(() => {
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "engineer@example.com",
          message: "Task 123 has been raised by test@example.com",
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Ticket submitted successfully!/i)).toBeInTheDocument();
    });
  });

  it("handles ticket submission failure", async () => {
    submitTicket.mockRejectedValue({
      type: "tickets/submitTicket/rejected",
      payload: "Failed to submit ticket",
    });

    render(
      <Provider store={store}>
        <TicketForm />
        <ToastContainer />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Address"), {
      target: { value: "123 Test Street" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe your issue or request in detail"),
      { target: { value: "Issue description" } }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter pincode"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByText(/Submit Ticket/i));

    await waitFor(() => {
      expect(submitTicket).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit ticket!/i)).toBeInTheDocument();
    });
  });
});
