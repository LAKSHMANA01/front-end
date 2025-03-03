import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AdminTaskCard from "./AdminTaskCard";
import { ToastContainer, toast } from "react-toastify";
import apiClient from "../../utils/apiClientAdmin";
import { useLocation } from "react-router-dom";

// Mock react-redux to provide a custom dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock react-router-dom's useLocation
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

// Mock toast notifications
jest.mock("react-toastify", () => {
  const actual = jest.requireActual("react-toastify");
  return {
    ...actual,
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    },
  };
});

// Mock the apiClient
jest.mock("../../utils/apiClientAdmin");

describe("AdminTaskCard", () => {
  const sampleTask = {
    _id: "task1",
    serviceType: "Plumbing",
    status: "pending",
    priority: "high",
    description: "Fix the sink",
    address: "123 Main St",
    pincode: "123456",
    engineerEmail: "engineer@example.com",
    createdAt: new Date("2023-01-01").toISOString(),
    updatedAt: new Date("2023-01-02").toISOString(),
  };

  beforeEach(() => {
    useLocation.mockReturnValue({ pathname: "/admin/deferred" });
    mockDispatch.mockClear();
    jest.clearAllMocks();
  });

  const renderComponent = (task = sampleTask) =>
    render(
      <>
        <AdminTaskCard task={task} />
        <ToastContainer />
      </>
    );

  test("renders task details correctly", () => {
    renderComponent();

    // Header details
    expect(screen.getByText(sampleTask.serviceType)).toBeInTheDocument();
    expect(screen.getByText(sampleTask.status)).toBeInTheDocument();
    expect(screen.getByText(sampleTask.priority)).toBeInTheDocument();

    // Card content details
    expect(
      screen.getByText(`Description : ${sampleTask.description}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Address : ${sampleTask.address}`)).toBeInTheDocument();
    expect(screen.getByText(`Pincode : ${sampleTask.pincode}`)).toBeInTheDocument();

    // Current Engineer and Dates
    expect(
      screen.getByText(`Current Engineer: ${sampleTask.engineerEmail}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Created At: ${new Date(sampleTask.createdAt).toLocaleDateString()}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Updated At: ${new Date(sampleTask.updatedAt).toLocaleDateString()}`)
    ).toBeInTheDocument();

    // Reassign button should be visible due to location "/admin/deferred"
    expect(screen.getByRole("button", { name: /Reassign/i })).toBeInTheDocument();
  });


  test("fetches eligible engineers and displays dropdown", async () => {
    const engineers = [
      {
        _id: "eng1",
        name: "John Doe",
        email: "john@example.com",
        currentTasks: 2,
        specialization: "Plumbing",
        address: "456 Side St",
        pincode: "654321",
      },
    ];

    // Mock a successful API call for eligible engineers
    apiClient.get.mockResolvedValue({
      data: { success: true, engineers },
    });

    renderComponent();

    // Click the Reassign button to open dropdown and trigger API call
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
      // Engineer's name should appear in the dropdown
      expect(screen.getByText(engineers[0].name)).toBeInTheDocument();
      expect(screen.getByText("Available")).toBeInTheDocument();
    });
  });

  test("shows warning toast if no eligible engineers available", async () => {
    // API returns an empty list of engineers
    apiClient.get.mockResolvedValue({
      data: { success: true, engineers: [] },
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
      expect(
        screen.getByText(
          `No eligible engineers available with ${sampleTask.serviceType} specialization`
        )
      ).toBeInTheDocument();
      expect(toast.warning).toHaveBeenCalled();
    });
  });

  test("handles error during fetching eligible engineers", async () => {
    // Simulate an API error
    apiClient.get.mockRejectedValue(new Error("Fetch error"));

    renderComponent();
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
      // Error message should appear
      expect(screen.getByText("Fetch error")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch eligible engineers");
    });
  });

  test("reassigns engineer successfully", async () => {
    const engineers = [
      {
        _id: "eng1",
        name: "John Doe",
        email: "john@example.com",
        currentTasks: 2,
        specialization: "Plumbing",
        address: "456 Side St",
        pincode: "654321",
      },
    ];

    // Successful eligible engineers API call
    apiClient.get.mockResolvedValue({
      data: { success: true, engineers },
    });

    // Successful patch call for reassign
    apiClient.patch.mockResolvedValue({
      data: { success: true },
    });

    renderComponent();

    // Open dropdown
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
      expect(screen.getByText(engineers[0].name)).toBeInTheDocument();
    });

    // Click on the engineer to trigger reassignment
    fireEvent.click(screen.getByText(engineers[0].name));

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        `Task reassigned to ${engineers[0].name} successfully!`
      );
      // Ensure dropdown is closed
      expect(screen.queryByText(engineers[0].name)).not.toBeInTheDocument();
      // Verify that dispatch was called to update tasks
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test("handles error during reassign engineer process", async () => {
    const engineers = [
      {
        _id: "eng1",
        name: "John Doe",
        email: "john@example.com",
        currentTasks: 2,
        specialization: "Plumbing",
        address: "456 Side St",
        pincode: "654321",
      },
    ];

    // Eligible engineers API call succeeds
    apiClient.get.mockResolvedValue({
      data: { success: true, engineers },
    });

    // Patch API call returns failure
    apiClient.patch.mockResolvedValue({
      data: { success: false, message: "Reassign failed" },
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
    });

    // Click on the engineer item to trigger reassign attempt
    fireEvent.click(screen.getByText(engineers[0].name));

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalled();
      expect(screen.getByText("Reassign failed")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Reassign failed");
    });
  });

  test("handles error when invalid engineer email is provided", async () => {
    // Simulate an engineer with an invalid email
    const engineers = [
      {
        _id: "eng1",
        name: "John Doe",
        email: "", // invalid email
        currentTasks: 2,
        specialization: "Plumbing",
        address: "456 Side St",
        pincode: "654321",
      },
    ];

    apiClient.get.mockResolvedValue({
      data: { success: true, engineers },
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /Reassign/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Clicking the engineer with an empty email should trigger an error
    fireEvent.click(screen.getByText("John Doe"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid engineer ID");
    });
  });
});