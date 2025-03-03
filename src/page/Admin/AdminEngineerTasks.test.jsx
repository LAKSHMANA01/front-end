// AdminEngineerTasks.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminEngineerTasks from "./AdminEngineerTasks";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEngineerTasks } from "../../redux/Slice/AdminSlice";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock react-router-dom useParams hook
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

// Mock the fetchEngineerTasks action creator
jest.mock("../../redux/Slice/AdminSlice", () => ({
  fetchEngineerTasks: jest.fn(() => ({ type: "FETCH_ENGINEER_TASKS" })),
}));

// Mock the AdminTaskCard component for testing purposes
jest.mock("./AdminTaskCard", () => (props) => {
  return <div data-testid="admin-task-card">Task ID: {props.task.id}</div>;
});

describe("AdminEngineerTasks", () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: true, tasks: [], error: null },
      })
    );
    render(<AdminEngineerTasks />);
    expect(
      screen.getByText(/Loading tasks.../i)
    ).toBeInTheDocument();
  });

  test("renders error state", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks: [], error: "Error message" },
      })
    );
    render(<AdminEngineerTasks />);
    expect(
      screen.getByText(/Error: Error message/i)
    ).toBeInTheDocument();
  });

  test("renders no tasks message when tasks is empty", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks: [], error: null },
      })
    );
    render(<AdminEngineerTasks />);
    expect(
      screen.getByText(/No tasks assigned./i)
    ).toBeInTheDocument();
  });

  test("renders no tasks message when tasks is undefined", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks: undefined, error: null },
      })
    );
    render(<AdminEngineerTasks />);
    expect(
      screen.getByText(/No tasks assigned./i)
    ).toBeInTheDocument();
  });

  test("renders tasks list when tasks exist", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    const tasks = [{ id: 1 }, { id: 2 }];
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks, error: null },
      })
    );
    render(<AdminEngineerTasks />);
    expect(
      screen.getByText(/Tasks Assigned to Engineer/i)
    ).toBeInTheDocument();

    // Verify that the correct number of AdminTaskCard components are rendered
    const taskCards = screen.getAllByTestId("admin-task-card");
    expect(taskCards).toHaveLength(tasks.length);
    expect(taskCards[0]).toHaveTextContent("Task ID: 1");
    expect(taskCards[1]).toHaveTextContent("Task ID: 2");
  });

  test("dispatches fetchEngineerTasks when email exists", () => {
    useParams.mockReturnValue({ email: "test@example.com" });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks: [], error: null },
      })
    );
    render(<AdminEngineerTasks />);
    // useEffect should trigger a dispatch
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(fetchEngineerTasks).toHaveBeenCalledWith("test@example.com");
  });

  test("does not dispatch fetchEngineerTasks when email is not provided", () => {
    useParams.mockReturnValue({ email: undefined });
    useSelector.mockImplementation((selector) =>
      selector({
        admin: { loading: false, tasks: [], error: null },
      })
    );
    render(<AdminEngineerTasks />);
    // Since email is falsy, dispatch should not be called
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});