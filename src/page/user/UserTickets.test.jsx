import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { fetchTickets } from "../../redux/Slice/UserSlice";
import UserTicketList from "./UserTickets";

// Mock store with thunk middleware
const mockStore = configureMockStore([thunk]);

describe("UserTicketList Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { user: { email: "test@example.com", role: "user" } },
      tickets: { tasks: [], loading: false, error: null },
    });

    store.dispatch = jest.fn(); // Mock dispatch
  });

  test("renders loading state initially", () => {
    store = mockStore({
      auth: { user: { email: "test@example.com", role: "user" } },
      tickets: { tasks: [], loading: true, error: null },
    });

    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders error message if error occurs", () => {
    store = mockStore({
      auth: { user: { email: "test@example.com", role: "user" } },
      tickets: { tasks: [], loading: false, error: "Something went wrong" },
    });

    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  test("renders tasks when available", () => {
    store = mockStore({
      auth: { user: { email: "test@example.com", role: "user" } },
      tickets: {
        tasks: [{ _id: "1", title: "Task 1" }],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );

    expect(screen.getByText(/task 1/i)).toBeInTheDocument();
  });

  test("dispatches fetchTickets on mount if email exists", () => {
    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchTickets({ userEmail: "test@example.com", role: "user" })
    );
  });
});
