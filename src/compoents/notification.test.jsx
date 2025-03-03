// Notifications.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notifications from './notification';

// Mock react-redux hooks
import { useDispatch, useSelector } from 'react-redux';
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the action creators
import { fetchNotifications, markAsRead } from '../redux/Slice/notificationSlice';
jest.mock('../redux/Slice/notificationSlice', () => ({
  fetchNotifications: jest.fn((userId) => ({ type: 'FETCH_NOTIFICATIONS', payload: userId })),
  markAsRead: jest.fn((notifId) => ({ type: 'MARK_AS_READ', payload: notifId })),
}));

describe('Notifications Component', () => {
  let mockDispatch;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test('dispatches fetchNotifications in useEffect when userId exists', () => {
    sessionStorage.setItem("email", "user@example.com");
    // Provide default state with empty notifications and not loading
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: [], loading: false } })
    );
    render(<Notifications />);
    
    // Verify that fetchNotifications is called with the userId
    expect(fetchNotifications).toHaveBeenCalledWith("user@example.com");
    expect(mockDispatch).toHaveBeenCalledWith(fetchNotifications("user@example.com"));
  });

  test('does not dispatch fetchNotifications if no userId', () => {
    sessionStorage.removeItem("email");
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: [], loading: false } })
    );
    render(<Notifications />);
    
    // fetchNotifications should not be called because no userId is present
    expect(fetchNotifications).not.toHaveBeenCalled();
  });

  test('renders Loading... text when loading is true', () => {
    sessionStorage.setItem("email", "user@example.com");
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: [], loading: true } })
    );
    render(<Notifications />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test('renders "No new notifications" when loading is false and notifications are empty', () => {
    sessionStorage.setItem("email", "user@example.com");
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: [], loading: false } })
    );
    render(<Notifications />);
    
    expect(screen.getByText("No new notifications")).toBeInTheDocument();
  });

  test('renders a list of notifications and dispatches markAsRead when a button is clicked', () => {
    sessionStorage.setItem("email", "user@example.com");
    const mockNotifications = [
      { _id: '1', message: 'Notification 1' },
      { _id: '2', message: 'Notification 2' },
    ];
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: mockNotifications, loading: false } })
    );
    render(<Notifications />);
    
    // Verify that each notification message is rendered
    expect(screen.getByText("Notification 1")).toBeInTheDocument();
    expect(screen.getByText("Notification 2")).toBeInTheDocument();
    
    // There should be a "Mark as Read" button for each notification
    const markButtons = screen.getAllByText("Mark as Read");
    expect(markButtons.length).toBe(2);
    
    // Click the first button and verify dispatch of markAsRead with corresponding id
    fireEvent.click(markButtons[0]);
    expect(mockDispatch).toHaveBeenCalledWith(markAsRead('1'));
    
    // Click the second button and verify dispatch of markAsRead with corresponding id
    fireEvent.click(markButtons[1]);
    expect(mockDispatch).toHaveBeenCalledWith(markAsRead('2'));
  });

  test('matches snapshot', () => {
    sessionStorage.setItem("email", "user@example.com");
    useSelector.mockImplementation(callback =>
      callback({ notifications: { notifications: [], loading: false } })
    );
    const { container } = render(<Notifications />);
    expect(container).toMatchSnapshot();
  });
});