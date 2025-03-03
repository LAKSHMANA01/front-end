// Navbar.test.jsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock lucide-react icons (we rely on their rendered output being irrelevant)
jest.mock('lucide-react', () => {
  const FakeIcon = ({ size, className }) => <svg data-size={size} className={className} />;
  return {
    Menu: (props) => <FakeIcon {...props} data-testid="menu-icon" />,
    Bell: (props) => <FakeIcon {...props} data-testid="bell-icon" />,
    User: (props) => <FakeIcon {...props} data-testid="user-icon" />,
    LogOut: (props) => <FakeIcon {...props} data-testid="logout-icon" />,
  };
});

// Mock Notification component so that we can easily check if it renders
jest.mock('./notification', () => () => <div>Notification</div>);

// Mock react-redux hooks
import { useDispatch, useSelector } from 'react-redux';
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock fetchNotifications action creator
import { fetchNotifications } from "../redux/Slice/notificationSlice";
jest.mock("../redux/Slice/notificationSlice", () => ({
  fetchNotifications: jest.fn((email) => ({ type: 'FETCH_NOTIFICATIONS', payload: email })),
}));

// Setup a dummy implementation for useSelector
const mockNotifications = [
  { isRead: false },
  { isRead: true },
];
const setupUseSelector = (notifications = mockNotifications) => {
  useSelector.mockImplementation(callback =>
    callback({ notifications: { notifications } })
  );
};

describe('Navbar Component', () => {
  let mockDispatch;
  let mockToggleSidebar;

  beforeEach(() => {
    // Use fake timers to test setInterval
    jest.useFakeTimers();
    // Reset mocks and sessionStorage before each test
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    setupUseSelector(); // default: one unread and one read => count = 1
    sessionStorage.setItem("email", "john@example.com");
    mockToggleSidebar = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('renders header and sidebar toggle button, and calls toggleSidebar when clicked', () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    // Check header text is rendered
    expect(screen.getByText("Telecom Services")).toBeInTheDocument();
    // There are several buttons. The first button in the document (left side) is for toggling the sidebar.
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test('displays user name extracted from sessionStorage email', () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    // "john@example.com" becomes "john"
    expect(screen.getByText("john")).toBeInTheDocument();
  });

  test('displays "Guest" when no email is found in sessionStorage', () => {
    sessionStorage.removeItem("email");
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    expect(screen.getByText("Guest")).toBeInTheDocument();
  });

  test('notification button toggles Notification component and shows unread count badge', () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    // There are multiple buttons; the second button (index 1) is the notification button.
    const buttons = screen.getAllByRole("button");
    const notificationButton = buttons[1];
    // Initially, Notification component is not rendered.
    expect(screen.queryByText("Notification")).not.toBeInTheDocument();
    // Unread notifications count is 1; so the badge with "1" should be rendered.
    expect(screen.getByText("1")).toBeInTheDocument();
    // Click the notification button to toggle on the Notification component.
    fireEvent.click(notificationButton);
    expect(screen.getByText("Notification")).toBeInTheDocument();
    // Click again to toggle off.
    fireEvent.click(notificationButton);
    expect(screen.queryByText("Notification")).not.toBeInTheDocument();
  });

  test('profile dropdown toggles on profile button click and contains logout link', () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    // The profile section is rendered as the third button (index 2) in the document.
    const buttons = screen.getAllByRole("button");
    const profileButton = buttons[2];
    // Initially, dropdown should not be visible.
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    // Click to open the dropdown.
    fireEvent.click(profileButton);
    // Now the Logout link should appear.
    expect(screen.getByText("Logout")).toBeInTheDocument();
    // Spy on console.log for the logout button click.
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // The logout button is rendered inside the dropdown.
    const logoutButton = screen.getByText("Logout").closest("button");
    fireEvent.click(logoutButton);
    expect(consoleSpy).toHaveBeenCalledWith('Logout clicked');
    consoleSpy.mockRestore();
    // Click profile button again to close the dropdown.
    fireEvent.click(profileButton);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test('dispatches fetchNotifications on mount and on interval', () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);
    // On mount, useEffect dispatches fetchNotifications immediately.
    expect(fetchNotifications).toHaveBeenCalledWith("admin@gmail.com");
    const initialDispatchCalls = mockDispatch.mock.calls.length;
    // Advance time by 5000ms to trigger one interval callback.
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockDispatch.mock.calls.length).toBe(initialDispatchCalls + 1);
    // Advance again to trigger another dispatch.
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockDispatch.mock.calls.length).toBe(initialDispatchCalls + 2);
  });

  test('clears interval on unmount so that dispatch is not called further', () => {
    const { unmount } = render(<Navbar toggleSidebar={mockToggleSidebar} />);
    unmount();
    const callCountAfterUnmount = mockDispatch.mock.calls.length;
    act(() => {
      jest.advanceTimersByTime(50000);
    });
    expect(mockDispatch.mock.calls.length).toBe(callCountAfterUnmount);
  });
});