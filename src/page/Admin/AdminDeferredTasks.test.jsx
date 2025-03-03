import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import AdminDeferredTasks from "./AdminDeferredTasks";

// --- Mock the thunk action so it returns a plain object ---
jest.mock("../../redux/Slice/AdminSlice", () => ({
  fetchAllTasks: () => ({ type: "FETCH_ALL_TASKS" }),
}));

// --- Mock child components ---
jest.mock("./NavBar", () => {
  return function MockNavBar() {
    return <div data-testid="admin-navbar">Mock NavBar</div>;
  };
});

jest.mock("./AdminTaskCard", () => {
  return function MockTaskCard({ task }) {
    return <div data-testid="admin-task-card">{task.title}</div>;
  };
});

jest.mock("../../compoents/Loadingpage", () => {
  return function MockLoading() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// --- A dummy reducer that simply returns the state ---
const dummyReducer = (state = {}) => state;

// --- Helper to create a store without middleware ---
const createMockStore = (initialState) =>
  createStore(dummyReducer, initialState);

// --- Helper function to render with providers ---
const renderWithProviders = (component, store) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>{component}</Provider>
    </MemoryRouter>
  );
};

describe("AdminDeferredTasks Component", () => {
  test("renders loading state correctly", () => {
    const store = createMockStore({
      admin: { tasks: [], loading: true, error: null },
    });
    renderWithProviders(<AdminDeferredTasks />, store);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders error state correctly", () => {
    const store = createMockStore({
      admin: { tasks: [], loading: false, error: "Failed to fetch tasks" },
    });
    renderWithProviders(<AdminDeferredTasks />, store);
    expect(screen.getByText("Error: Failed to fetch tasks")).toBeInTheDocument();
  });

  test("renders empty state when no tasks", () => {
    const store = createMockStore({
      admin: { tasks: [], loading: false, error: null },
    });
    renderWithProviders(<AdminDeferredTasks />, store);
    expect(
      screen.getByText("No deferred tasks available.")
    ).toBeInTheDocument();
  });

  test("renders deferred tasks correctly", () => {
    const tasks = [
      { id: "1", title: "Task 1", status: "deferred", engineerEmail: "eng1@example.com" },
      { id: "2", title: "Task 2", status: "pending", engineerEmail: "eng2@example.com" },
      { id: "3", title: "Task 3", status: "failed", engineerEmail: "eng3@example.com" },
      { id: "4", title: "Task 4", status: "pending", engineerEmail: null },
      { id: "5", title: "Task 5", status: "completed", engineerEmail: null },
    ];
    const store = createMockStore({
      admin: { tasks, loading: false, error: null },
    });
    renderWithProviders(<AdminDeferredTasks />, store);

    // Expected filtering: Tasks 1, 3, 4, and 5 should be rendered.
    const taskCards = screen.getAllByTestId("admin-task-card");
    expect(taskCards).toHaveLength(4);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
    expect(screen.getByText("Task 4")).toBeInTheDocument();
    expect(screen.getByText("Task 5")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  test("dispatches fetchAllTasks on mount", () => {
    const mockDispatch = jest.fn();
    // Create a minimal fake store with a proper subscribe function.
    const fakeStore = {
      getState: () => ({ admin: { tasks: [], loading: false, error: null } }),
      subscribe: () => () => {},
      dispatch: mockDispatch,
    };

    render(
      <MemoryRouter>
        <Provider store={fakeStore}>
          <AdminDeferredTasks />
        </Provider>
      </MemoryRouter>
    );

    // Verify that the action returned by fetchAllTasks is dispatched on mount.
    expect(mockDispatch).toHaveBeenCalledWith({ type: "FETCH_ALL_TASKS" });
  });
});