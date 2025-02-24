import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AdminCompletedTasks from "./AdminCompletedTasks";
import { fetchAllTasks } from "../../redux/Slice/AdminSlice";
import thunk from "redux-thunk";

jest.mock("../../redux/Slice/AdminSlice", () => ({
  fetchAllTasks: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe("AdminCompletedTasks Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      admin: {
        tasks: [],
        loading: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  test("dispatches fetchAllTasks on mount", () => {
    render(
      <Provider store={store}>
        <AdminCompletedTasks />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchAllTasks());
  });

  test("renders loading message when loading", () => {
    store = mockStore({
      admin: { tasks: [], loading: true, error: null },
    });
    render(
      <Provider store={store}>
        <AdminCompletedTasks />
      </Provider>
    );
    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
  });

  test("renders error message when error occurs", () => {
    store = mockStore({
      admin: { tasks: [], loading: false, error: "Failed to load tasks" },
    });
    render(
      <Provider store={store}>
        <AdminCompletedTasks />
      </Provider>
    );
    expect(screen.getByText(/Error: Failed to load tasks/i)).toBeInTheDocument();
  });

  test("renders no completed tasks message when there are no completed tasks", () => {
    store = mockStore({
      admin: { tasks: [{ _id: "1", status: "pending" }], loading: false, error: null },
    });
    render(
      <Provider store={store}>
        <AdminCompletedTasks />
      </Provider>
    );
    expect(screen.getByText(/No completed tasks available./i)).toBeInTheDocument();
  });

  test("renders completed tasks correctly", () => {
    store = mockStore({
      admin: {
        tasks: [
          { _id: "1", status: "completed", name: "Task 1" },
          { _id: "2", status: "pending", name: "Task 2" },
          { _id: "3", status: "completed", name: "Task 3" },
        ],
        loading: false,
        error: null,
      },
    });
    render(
      <Provider store={store}>
        <AdminCompletedTasks />
      </Provider>
    );
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });
});
