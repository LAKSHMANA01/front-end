import React from "react";
import { render, waitFor } from "@testing-library/react";
import UserDashboard from "./Dashbord"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import apiClientEngineer from "../../utils/apiClientEngineer";
import { fetchTickets } from "../../redux/Slice/UserSlice";

// Instead of spying on properties, we override react-redux's hooks via jest.mock.
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the async thunk action creators from UserSlice.
jest.mock("../../redux/Slice/UserSlice", () => ({
  fetchTickets: {
    fulfilled: (tasks) => ({ type: "tickets/fetchTickets/fulfilled", payload: tasks }),
    rejected: (error) => ({ type: "tickets/fetchTickets/rejected", payload: error }),
  },
}));

// Mock the Dashbord component to render its props as JSON (so we can assert on them).
jest.mock("./../../compoents/Dashbord", () => (props) => {
  return <div data-testid="dashboard">{JSON.stringify(props)}</div>;
});

describe("UserDashboard", () => {
  // Default sample tasks.
  const sampleTasks = [
    { id: "1", serviceType: "Repair", status: "open", priority: "low" },
    { id: "2", serviceType: "Installation", status: "completed", priority: "high" },
    { id: "3", serviceType: "Maintenance", status: "in-progress", priority: "medium" },
  ];

  let dispatchMock;

  beforeEach(() => {
    // Mock dispatch and selector
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    // By default, return sampleTasks with no loading/error
    useSelector.mockImplementation((cb) =>
      cb({ tickets: { tasks: sampleTasks, loading: false, error: null } })
    );

    // Stub sessionStorage.getItem to return "test@example.com" by default
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => "test@example.com"),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   *  Covers lines 8–31:
   *    - The useEffect that fetches tasks from `/tasks/user/${email}`
   *    - Dispatching fetchTickets.fulfilled or fetchTickets.rejected
   */
  it("fetches tasks on mount (useEffect) and dispatches fulfilled action on success", async () => {
    const apiResponse = { data: { tasks: sampleTasks } };
    const apiGetSpy = jest.spyOn(apiClientEngineer, "get").mockResolvedValue(apiResponse);

    const { findByTestId } = render(
      <UserDashboard debouncedSearchTerm="" statusFilter="" priorityFilter="" />
    );

    // Wait until API is called
    await waitFor(() => {
      expect(apiGetSpy).toHaveBeenCalledWith("/tasks/user/test@example.com");
    });

    // Check that dispatch was called with the fulfilled action
    expect(dispatchMock).toHaveBeenCalledWith(fetchTickets.fulfilled(sampleTasks));

    // Check final rendered output
    const dashEl = await findByTestId("dashboard");
    const dashProps = JSON.parse(dashEl.textContent);
    expect(dashProps.loading).toBe(false);
    expect(dashProps.error).toBeNull();
  });

  it("handles API error (useEffect) and dispatches rejected action", async () => {
    const errorResponse = { response: { data: "API error" } };
    const apiGetSpy = jest.spyOn(apiClientEngineer, "get").mockRejectedValue(errorResponse);

    render(<UserDashboard />);

    await waitFor(() => {
      expect(apiGetSpy).toHaveBeenCalledWith("/tasks/user/test@example.com");
    });

    // Check that dispatch was called with the rejected action
    expect(dispatchMock).toHaveBeenCalledWith(fetchTickets.rejected("API error"));
  });

  /**
   *  Covers lines 56–64:
   *    - The loop that increments ticketStatusCounts and taskPriorityCounts
   *    - We supply tasks with recognized statuses/priorities to see them increment
   *    - Also can supply an "unrecognized" status/priority to ensure the if-checks are covered
   */
  it("increments ticketStatusCounts and taskPriorityCounts (forEach loop) correctly", async () => {
    const customTasks = [
      { id: "1", serviceType: "Test1", status: "open", priority: "low" },
      { id: "2", serviceType: "Test2", status: "Completed", priority: "High" },
      { id: "3", serviceType: "Test3", status: "unknown", priority: "Random" },
      { id: "4", serviceType: "Test4", status: "deferred", priority: "medium" },
    ];

    // Change the tasks returned by useSelector
    useSelector.mockImplementation((cb) =>
      cb({ tickets: { tasks: customTasks, loading: false, error: null } })
    );

    const { findByTestId } = render(
      <UserDashboard debouncedSearchTerm="" statusFilter="" priorityFilter="" />
    );

    const dashEl = await findByTestId("dashboard");
    const dashProps = JSON.parse(dashEl.textContent);

    // ticketStatusCounts:
    //   open -> 1
    //   in-progress -> 0
    //   completed -> 1 (case-insensitive, "Completed")
    //   failed -> 0
    //   deferred -> 1
    // => data = [1,0,1,0,1]
    expect(dashProps.ticketStatusData).toEqual({
      labels: ["open", "in-progress", "completed", "failed", "deferred"],
      datasets: [
        {
          label: "Ticket Status",
          data: [1, 0, 1, 0, 1],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
          borderWidth: 2,
        },
      ],
    });

    // taskPriorityCounts:
    //   low -> 1
    //   medium -> 1
    //   high -> 1
    // => data = [1,1,1]
    expect(dashProps.taskPriorityData).toEqual({
      labels: ["low", "medium", "high"],
      datasets: [
        {
          label: "Task Priority",
          data: [1, 1, 1],
          backgroundColor: ["#4CAF50", "#FFCE56", "#FF6384"],
          borderWidth: 2,
        },
      ],
    });
  });

  // Existing tests retained for completeness, ensuring overall coverage.
  it("renders Dashbord with correct computed props on successful API call", async () => {
    const apiResponse = { data: { tasks: sampleTasks } };
    const apiGetSpy = jest.spyOn(apiClientEngineer, "get").mockResolvedValue(apiResponse);

    const { findByTestId } = render(
      <UserDashboard debouncedSearchTerm="" statusFilter="" priorityFilter="" />
    );

    await waitFor(() => {
      expect(apiGetSpy).toHaveBeenCalledWith("/tasks/user/test@example.com");
    });
    expect(dispatchMock).toHaveBeenCalledWith(fetchTickets.fulfilled(sampleTasks));

    const dashboard = await findByTestId("dashboard");
    const props = JSON.parse(dashboard.textContent);

    // basic checks
    expect(props.role).toBe("user");
    expect(props.loading).toBe(false);
    expect(props.error).toBeNull();
  });

  it("filters tasks based on debouncedSearchTerm, statusFilter, and priorityFilter", async () => {
    const customTasks = [
      { id: "1", serviceType: "Repair", status: "open", priority: "low" },
      { id: "2", serviceType: "Installation", status: "completed", priority: "high" },
      { id: "3", serviceType: "Cleaning", status: "failed", priority: "medium" },
    ];
    useSelector.mockImplementation((cb) =>
      cb({ tickets: { tasks: customTasks, loading: false, error: null } })
    );

    const { findByTestId } = render(
      <UserDashboard debouncedSearchTerm="clean" statusFilter="failed" priorityFilter="medium" />
    );

    const dashboard = await findByTestId("dashboard");
    const props = JSON.parse(dashboard.textContent);

    // Only id="3" matches "clean", status=failed, priority=medium
    expect(props.ticketStatusData).toEqual({
      labels: ["open", "in-progress", "completed", "failed", "deferred"],
      datasets: [
        {
          label: "Ticket Status",
          data: [0, 0, 0, 1, 0],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
          borderWidth: 2,
        },
      ],
    });
    expect(props.taskPriorityData).toEqual({
      labels: ["low", "medium", "high"],
      datasets: [
        {
          label: "Task Priority",
          data: [0, 1, 0],
          backgroundColor: ["#4CAF50", "#FFCE56", "#FF6384"],
          borderWidth: 2,
        },
      ],
    });
  });

  it("handles API failure and dispatches rejected action (already tested above, but kept)", async () => {
    const errorResponse = { response: { data: "API error" } };
    const apiGetSpy = jest.spyOn(apiClientEngineer, "get").mockRejectedValue(errorResponse);

    render(
      <UserDashboard debouncedSearchTerm="" statusFilter="" priorityFilter="" />
    );

    await waitFor(() => {
      expect(apiGetSpy).toHaveBeenCalledWith("/tasks/user/test@example.com");
    });
    expect(dispatchMock).toHaveBeenCalledWith(fetchTickets.rejected("API error"));
  });
});