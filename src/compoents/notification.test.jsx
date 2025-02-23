// src/components/Notifications.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Notifications from "./notification";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../redux/Slice/notificationSlice";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock action creators from notificationSlice
jest.mock("../redux/Slice/notificationSlice", () => ({
  fetchNotifications: jest.fn((userId) => ({ type: "FETCH_NOTIFICATIONS", payload: userId })),
  markAsRead: jest.fn((id) => ({ type: "MARK_AS_READ", payload: id })),
}));

describe("Notifications Component", () => {
  let mockDispatch;
  
  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches fetchNotifications on mount when userId exists", () => {
    sessionStorage.setItem("email", "test@example.com");
    useSelector.mockReturnValue({ notifications: [], loading: false });
    
    render(<Notifications />);
    
    // On mount, useEffect should dispatch fetchNotifications with the userId.
    expect(mockDispatch).toHaveBeenCalledWith(fetchNotifications("test@example.com"));
  });

  test("does not dispatch fetchNotifications when userId is null", () => {
    // No email is set in sessionStorage.
    useSelector.mockReturnValue({ notifications: [], loading: false });
    
    render(<Notifications />);
    
    // Dispatch should not be called since userId is null.
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: "FETCH_NOTIFICATIONS" }));
  });

  test("renders loading state when loading is true", () => {
    sessionStorage.setItem("email", "test@example.com");
    useSelector.mockReturnValue({ notifications: [], loading: true });
    
    render(<Notifications />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test('renders "No new notifications" when not loading and notifications array is empty', () => {
    sessionStorage.setItem("email", "test@example.com");
    useSelector.mockReturnValue({ notifications: [], loading: false });
    
    render(<Notifications />);
    expect(screen.getByText("No new notifications")).toBeInTheDocument();
  });

  test("renders notifications and calls markAsRead when button is clicked", () => {
    sessionStorage.setItem("email", "test@example.com");
    const notificationsData = [
      { _id: "1", message: "Notification 1" },
      { _id: "2", message: "Notification 2" },
    ];
    useSelector.mockReturnValue({ notifications: notificationsData, loading: false });
    
    render(<Notifications />);
    
    // Verify that both notification messages are rendered.
    expect(screen.getByText("Notification 1")).toBeInTheDocument();
    expect(screen.getByText("Notification 2")).toBeInTheDocument();
    
    // Find all "Mark as Read" buttons and click the first one.
    const buttons = screen.getAllByText("Mark as Read");
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);
    
    // Verify that dispatch was called with markAsRead for the first notification.
    expect(mockDispatch).toHaveBeenCalledWith(markAsRead("1"));
  });
});
