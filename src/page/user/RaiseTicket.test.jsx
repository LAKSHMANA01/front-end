/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import RaiseTicket from "./RaiseTicket";
import { useDispatch, useSelector } from "react-redux";
import { submitTicket } from "../../redux/Slice/raiseticke";
import "@testing-library/jest-dom";

// ---------------------------
// 1) Mock react-redux
// ---------------------------
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// ---------------------------
// 2) Mock the submitTicket thunk
//    using a 'fulfilled'/'rejected' approach
// ---------------------------
jest.mock("../../redux/Slice/raiseticke", () => ({
  // If you have other named exports, you can keep them,
  // but here's how we replicate a "fulfilled"/"rejected" style:
  submitTicket: {
    fulfilled: (payload) => ({
      type: "ticket/submitTicket/fulfilled",
      payload,
    }),
    rejected: (error) => ({
      type: "ticket/submitTicket/rejected",
      payload: error,
      error: true,
    }),
  },
}));

describe("RaiseTicket Tests (similar style to Dashboard tests)", () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    // By default, we can let useSelector return any needed initial state
    useSelector.mockImplementation((fn) =>
      fn({ Raisetickets: {}, auth: { user: null } })
    );

    // Mock sessionStorage
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => null), // default: no email
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test #1: Renders the form fields and checks for "Raise New Ticket".
   */
  it("renders the RaiseTicket component with all fields", async () => {
    // Suppose sessionStorage *does* have email in this scenario
    window.sessionStorage.getItem.mockReturnValue("testuser@example.com");

    render(
      <Provider store={{ dispatch: dispatchMock }}>
        <RaiseTicket />
        <ToastContainer />
      </Provider>
    );

    // The heading or card title
    expect(screen.getByText(/Raise New Ticket/i)).toBeInTheDocument();

    // Form fields
    expect(screen.getByLabelText(/Service Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();

    // The submit button
    expect(
      screen.getByRole("button", { name: /Submit Ticket/i })
    ).toBeInTheDocument();
  });

  /**
   * Test #2: If no email in sessionStorage, shows an error toast & doesn't dispatch.
   */
  it("shows an error toast if no email is found in sessionStorage", async () => {
    // Return null from sessionStorage (default in beforeEach)
    window.sessionStorage.getItem.mockReturnValue(null);

    render(
      <Provider store={{ dispatch: dispatchMock }}>
        <RaiseTicket />
        <ToastContainer />
      </Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "Some Address" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Some Description" },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: "12345" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Submit Ticket/i }));

    // Expect an error toast
    await waitFor(() => {
      expect(screen.getByText(/User email not found!/i)).toBeInTheDocument();
    });

    // No dispatch calls made
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  /**
   * Test #3: Successful submission if email exists.
   * We simulate a 'submitTicket.fulfilled()' scenario.
   */
  it("submits ticket successfully (email found) and resets form", async () => {
    window.sessionStorage.getItem.mockReturnValue("testuser@example.com");

    // We'll mock the actual dispatch to return a "fulfilled" action
    dispatchMock.mockResolvedValueOnce(
      submitTicket.fulfilled({ success: true })
    );

    render(
      <Provider store={{ dispatch: dispatchMock }}>
        <RaiseTicket />
        <ToastContainer />
      </Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Need help" },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: "99999" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Submit Ticket/i }));

    // Wait for success toast
    await waitFor(() => {
      expect(
        screen.getByText(/Ticket submitted successfully!/i)
      ).toBeInTheDocument();
    });

    // Check if dispatch was called with the correct payload
    // NOTE: The real dispatch call for a thunk is typically a function,
    // but for test simplicity, we assume your code does something like:
    //   dispatch({ type: 'ticket/submitTicket', payload: {...} })
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "ticket/submitTicket",
      payload: {
        serviceType: "installation", // from default state in your component
        address: "123 Main St",
        description: "Need help",
        pincode: "99999",
        email: "testuser@example.com",
      },
    });

    // The form should be reset
    expect(screen.getByLabelText(/Address/i)).toHaveValue("");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("");
    expect(screen.getByLabelText(/Pincode/i)).toHaveValue("");
  });

  /**
   * Test #4: Failed submission => should show a "Failed to submit ticket!" toast.
   */
  it("shows an error toast when submitTicket is rejected", async () => {
    window.sessionStorage.getItem.mockReturnValue("testuser@example.com");

    // Dispatch mock returns a 'rejected' action
    dispatchMock.mockRejectedValueOnce(
      submitTicket.rejected("Network error!")
    );

    render(
      <Provider store={{ dispatch: dispatchMock }}>
        <RaiseTicket />
        <ToastContainer />
      </Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "Fail Address" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Fail Desc" },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: "00000" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Submit Ticket/i }));

    // Should show "Failed to submit ticket!"
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to submit ticket!/i)
      ).toBeInTheDocument();
    });

    // Fields remain filled or reset depending on your logic:
    // Adjust your expectation if your component resets fields on error.
    // For example:
    expect(screen.getByLabelText(/Address/i)).toHaveValue("Fail Address");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("Fail Desc");
    expect(screen.getByLabelText(/Pincode/i)).toHaveValue("00000");

    // Optionally check dispatch arguments
    // ...
  });
});