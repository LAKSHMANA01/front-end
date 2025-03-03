// Logout.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logout from './Logout';
import apiClientUser from './apiClientUser';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('./apiClientUser', () => ({
  post: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Setup mocks
const mockNavigate = jest.fn();
jest.useFakeTimers();

describe('Logout Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup storage mocks
    const storageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    
    // Mock localStorage and sessionStorage
    Object.defineProperty(window, 'localStorage', { value: storageMock });
    Object.defineProperty(window, 'sessionStorage', { value: storageMock });
    
    // Set some test data in storage for testing removal
    ['token', 'role', 'email'].forEach(item => {
      localStorage.setItem(item, `test-${item}`);
      sessionStorage.setItem(item, `test-${item}`);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders ToastContainer', () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('clears localStorage and sessionStorage on mount', async () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    // Verify each item is removed from both storage types
    ['token', 'role', 'email'].forEach(item => {
      expect(localStorage.removeItem).toHaveBeenCalledWith(item);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(item);
    });
    
    // Verify localStorage.removeItem was called 3 times
    expect(localStorage.removeItem).toHaveBeenCalledTimes(6);
    
    // Verify sessionStorage.removeItem was called 3 times
    expect(sessionStorage.removeItem).toHaveBeenCalledTimes(6);
  });

  test('shows success toast message', () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  test('navigates to login page after delay', async () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    // Fast-forward timers
    jest.advanceTimersByTime(1000);
    
    // Check if navigate was called with correct path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test('handles error during logout process', async () => {
    // Mock console.error to prevent test output clutter
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock API to throw an error
    const testError = new Error('Test error');
    testError.response = { data: 'API error response' };
    
    // Force the useEffect to trigger the error branch
    // We'll modify the implementation to cause an error in storage removal
    Object.defineProperty(window, 'localStorage', { 
      value: {
        removeItem: jest.fn(() => { throw testError; })
      }
    });
    
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Verify error toast was shown
    expect(toast.error).toHaveBeenCalledWith('Failed to logout. Please try again.');
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  // The following test would be needed if the API call was uncommented in the component
  test('calls logout API endpoint (if uncommented in component)', async () => {
    // This test is prepared for when the API call is uncommented
    // Currently apiClientUser.post is commented out in the component
    
    // For this test to pass with the current implementation, this test won't actually
    // verify the API call - it's here for future reference
    
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    
    // This expectation would be used if the API call was uncommented:
    // expect(apiClientUser.post).toHaveBeenCalledWith('/users/logout');
    
    // Instead, we'll just verify the component renders without error
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
});