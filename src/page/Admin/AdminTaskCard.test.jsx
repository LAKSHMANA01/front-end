import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AdminTaskCard from './AdminTaskCard';
import apiClient from '../../utils/apiClientAdmin';
import { fetchDeferredTasks } from '../../redux/Slice/AdminSlice';

// --- Mock the API client ---
jest.mock('../../utils/apiClientAdmin', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

// --- Mock the fetchDeferredTasks action ---
jest.mock('../../redux/Slice/AdminSlice', () => ({
  fetchDeferredTasks: jest.fn(() => ({ type: 'FETCH_DEFERRED_TASKS' })),
}));

// --- Mock react-redux's useDispatch ---
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

// --- Mock react-router-dom's useLocation ---
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('AdminTaskCard Component', () => {
  let mockDispatch;
  const { useDispatch } = require('react-redux');
  const { useLocation } = require('react-router-dom');

  const defaultTask = {
    _id: '1',
    serviceType: 'Cleaning',
    status: 'open',
    priority: 'low',
    description: 'Test description',
    engineerEmail: 'eng@example.com',
    assignee: 'Old Assignee'
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    // By default, use a pathname that is not '/admin/deferred'
    useLocation.mockReturnValue({ pathname: '/somepath' });
    // Clear previous mock calls
    apiClient.get.mockClear();
    apiClient.patch.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders card header and content correctly', () => {
    render(<AdminTaskCard task={defaultTask} />);
    // Service type should be rendered in uppercase.
    expect(screen.getByText('CLEANING')).toBeInTheDocument();
    // Status and priority texts are rendered.
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
    // Description is rendered.
    expect(screen.getByText('Test description')).toBeInTheDocument();
    // Current engineer info is shown.
    expect(screen.getByText(/Current Engineer:/)).toHaveTextContent('Current Engineer: eng@example.com');
    // Since location is not "/admin/deferred", the Reassign button should not be rendered.
    expect(screen.queryByText('Reassign')).not.toBeInTheDocument();
  });

  test('shows Reassign button when location.pathname is "/admin/deferred"', async () => {
    // Set location pathname to "/admin/deferred" so that the useEffect sets Button to true.
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    render(<AdminTaskCard task={defaultTask} />);
    // Wait for useEffect to run.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Reassign/i })).toBeInTheDocument();
    });
    const button = screen.getByRole('button', { name: /Reassign/i });
    // Button should not be disabled when not loading.
    expect(button).not.toBeDisabled();
  });

  test('fetches available engineers and renders dropdown options when Reassign is clicked', async () => {
    // Set location to trigger button rendering.
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Mock API GET to resolve with a valid response containing one approved engineer.
    const engineerData = {
      engineers: [
        {
          _id: 'e1',
          name: 'John Doe',
          isEngineer: true,
          currentTasks: 2,
          specialization: 'Electrician',
          address: '123 St',
          pincode: '12345',
          email: 'john@example.com'
        }
      ]
    };
    apiClient.get.mockResolvedValue({ data: engineerData });

    render(<AdminTaskCard task={defaultTask} />);
    // Click the Reassign button to toggle the dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    // Wait for the async API call and dropdown rendering.
    await waitFor(() => {
      // The dropdown should show the engineer option. The initials "JD" should appear.
      expect(screen.getByText('JD')).toBeInTheDocument();
      // Also, the text "Available" should appear in the option.
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  test('handleReassignEngineer shows error for invalid task information', async () => {
    // Provide a task without _id.
    const invalidTask = { ...defaultTask };
    delete invalidTask._id;
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Mock API GET to return available engineers.
    const engineerData = {
      engineers: [
        {
          _id: 'e1',
          name: 'John Doe',
          isEngineer: true,
          currentTasks: 2,
          specialization: 'Electrician',
          address: '123 St',
          pincode: '12345',
          email: 'john@example.com'
        }
      ]
    };
    apiClient.get.mockResolvedValue({ data: engineerData });
    render(<AdminTaskCard task={invalidTask} />);
    // Open dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    // Wait for the dropdown options to appear.
    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
    // Click on the engineer option.
    act(() => {
      fireEvent.click(screen.getByText('JD'));
    });
    // Wait for error state update.
    await waitFor(() => {
      expect(screen.getByText(/Invalid task information/)).toBeInTheDocument();
    });
  });

  test('handleReassignEngineer shows error for invalid engineer ID', async () => {
    // Provide valid task.
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Mock API GET to return an engineer with empty email.
    const engineerData = {
      engineers: [
        {
          _id: 'e2',
          name: 'Jane Doe',
          isEngineer: true,
          currentTasks: 1,
          specialization: 'Plumbing',
          address: '456 St',
          pincode: '67890',
          email: '' // Invalid email
        }
      ]
    };
    apiClient.get.mockResolvedValue({ data: engineerData });
    render(<AdminTaskCard task={defaultTask} />);
    // Open dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
    // Click on the engineer option.
    act(() => {
      fireEvent.click(screen.getByText('JD'));
    });
    // Wait for error message.
    await waitFor(() => {
      expect(screen.getByText(/Invalid engineer ID/)).toBeInTheDocument();
    });
  });

  test('handleReassignEngineer succeeds and dispatches fetchDeferredTasks', async () => {
    // Provide valid task.
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Mock API GET to return an approved engineer.
    const engineerData = {
      engineers: [
        {
          _id: 'e3',
          name: 'Alice Smith',
          isEngineer: true,
          currentTasks: 1,
          specialization: 'Carpentry',
          address: '789 St',
          pincode: '11111',
          email: 'alice@example.com'
        }
      ]
    };
    apiClient.get.mockResolvedValue({ data: engineerData });
    // Mock API PATCH to resolve with a non-falsey response.
    apiClient.patch.mockResolvedValue({ data: { success: true } });

    render(<AdminTaskCard task={defaultTask} />);
    // Open dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    // Wait for engineer option to appear.
    await waitFor(() => {
      expect(screen.getByText('AS')).toBeInTheDocument();
    });
    // Click on the engineer option.
    act(() => {
      fireEvent.click(screen.getByText('AS'));
    });
    // Wait for API PATCH to be called and dispatch to be invoked.
    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith(
        `/admin/reassign/${defaultTask._id}/alice@example.com`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(mockDispatch).toHaveBeenCalledWith(fetchDeferredTasks());
      // After reassignment, the dropdown should be closed.
      expect(screen.queryByText('AS')).not.toBeInTheDocument();
    });
  });

  test('displays loading spinner in dropdown when loading is true', async () => {
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Create a promise that does not resolve immediately.
    let resolveGet;
    const getPromise = new Promise((resolve) => {
      resolveGet = resolve;
    });
    apiClient.get.mockReturnValue(getPromise);
    render(<AdminTaskCard task={defaultTask} />);
    // Open dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    // Immediately, the dropdown should show the loading spinner.
    expect(screen.getByText(/Processing\.\.\./i)).toBeInTheDocument();
    // Now resolve the promise.
    act(() => {
      resolveGet({ data: { engineers: [] } });
    });
    // Wait for the spinner to disappear and "No engineers available" to appear.
    await waitFor(() => {
      expect(screen.getByText(/No engineers available/i)).toBeInTheDocument();
    });
  });

  test('displays "No engineers available" when API returns an empty list', async () => {
    useLocation.mockReturnValue({ pathname: '/admin/deferred' });
    // Mock API GET to return an empty engineers array.
    apiClient.get.mockResolvedValue({ data: { engineers: [] } });
    render(<AdminTaskCard task={defaultTask} />);
    // Open dropdown.
    const button = await screen.findByRole('button', { name: /Reassign/i });
    act(() => {
      fireEvent.click(button);
    });
    // Wait for the dropdown to display the message.
    await waitFor(() => {
      expect(screen.getByText(/No engineers available/i)).toBeInTheDocument();
    });
  });
});