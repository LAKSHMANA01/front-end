import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDashboard from './Dashbord';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from '../../redux/Slice/UserSlice';
import apiClientEngineer from '../../utils/apiClientEngineer';

// Mock the apiClientEngineer module
jest.mock('../../utils/apiClientEngineer', () => ({
  get: jest.fn(),
}));

// Mock the Dashbord component to simply render its props for inspection
jest.mock('./../../compoents/Dashbord', () => (props) => {
  return <div data-testid="dashboard">{JSON.stringify(props)}</div>;
});

describe('UserDashboard', () => {
  // Sample tasks data returned by the API
  const tasksData = [
    { id: 1, serviceType: 'email', status: 'completed', priority: 'high' },
    { id: 2, serviceType: 'call', status: 'pending', priority: 'medium' },
    { id: 3, serviceType: 'chat', status: 'open', priority: 'low' },
    { id: 4, serviceType: 'email', status: 'failed', priority: 'high' },
    { id: 5, serviceType: 'call', status: 'in-progress', priority: 'low' },
  ];

  let store;
  beforeEach(() => {
    // Set the email in sessionStorage
    window.sessionStorage.setItem('email', 'test@example.com');

    // Create a Redux store using the tickets reducer from your slice
    store = configureStore({
      reducer: { tickets: ticketsReducer },
    });

    // Mock the API call to return the sample tasks
    apiClientEngineer.get.mockResolvedValue({
      data: { tasks: tasksData },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  it('renders Dashbord with correct props after fetching tasks', async () => {
    render(
      <Provider store={store}>
        <UserDashboard debouncedSearchTerm="" statusFilter="" priorityFilter="" />
      </Provider>
    );

    // Wait for the API call to be made by the effect
    await waitFor(() => expect(apiClientEngineer.get).toHaveBeenCalledTimes(1));

    // Find the mocked Dashbord component and parse its props
    const dashboardEl = await screen.findByTestId('dashboard');
    const dashboardProps = JSON.parse(dashboardEl.textContent);

    // The component should have set loading to false and error to null
    expect(dashboardProps.loading).toBe(false);
    expect(dashboardProps.error).toBe(null);

    // Compute expected ticketStatusData from tasksData (all tasks, since filters are empty)
    // ticketStatusCounts for statuses: open:1, in-progress:1, completed:1, failed:1, deferred:0
    expect(dashboardProps.ticketStatusData).toEqual({
      labels: ['open', 'in-progress', 'completed', 'failed', 'deferred'],
      datasets: [
        {
          label: 'Ticket Status',
          data: [1, 1, 1, 1, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
          borderWidth: 2,
        },
      ],
    });

    // Compute expected taskPriorityData counts from tasksData:
    // low: tasks 3 and 5 (2), medium: task 2 (1), high: tasks 1 and 4 (2)
    expect(dashboardProps.taskPriorityData).toEqual({
      labels: ['low', 'medium', 'high'],
      datasets: [
        {
          label: 'Task Priority',
          data: [2, 1, 2],
          backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384'],
          borderWidth: 2,
        },
      ],
    });

    // Compute expected userData (computed directly from the full tasksData)
    expect(dashboardProps.data).toEqual({
      completedTasks: tasksData.filter((task) => task.status === 'completed'),
      pendingTasks: tasksData.filter((task) => task.status === 'pending'),
      totalTasks: tasksData.filter((task) => task.status === 'open'),
      failedTasks: tasksData.filter((task) => task.status === 'failed'),
    });
  });

  it('filters tasks based on search term, statusFilter, and priorityFilter', async () => {
    // For filtering: we want only tasks whose serviceType includes "email",
    // status exactly "completed", and priority exactly "high"
    render(
      <Provider store={store}>
        <UserDashboard debouncedSearchTerm="email" statusFilter="completed" priorityFilter="high" />
      </Provider>
    );

    await waitFor(() => expect(apiClientEngineer.get).toHaveBeenCalledTimes(1));

    const dashboardEl = await screen.findByTestId('dashboard');
    const dashboardProps = JSON.parse(dashboardEl.textContent);

    // When filters are applied, the chart data is computed based on the filtered tasks.
    // Only task 1 in tasksData meets: serviceType 'email', status 'completed', priority 'high'
    expect(dashboardProps.ticketStatusData).toEqual({
      labels: ['open', 'in-progress', 'completed', 'failed', 'deferred'],
      datasets: [
        {
          label: 'Ticket Status',
          data: [0, 0, 1, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'],
          borderWidth: 2,
        },
      ],
    });

    expect(dashboardProps.taskPriorityData).toEqual({
      labels: ['low', 'medium', 'high'],
      datasets: [
        {
          label: 'Task Priority',
          data: [0, 0, 1],
          backgroundColor: ['#4CAF50', '#FFCE56', '#FF6384'],
          borderWidth: 2,
        },
      ],
    });

    // Note: The userData is computed from the full tasks list (without filters)
    expect(dashboardProps.data).toEqual({
      completedTasks: tasksData.filter((task) => task.status === 'completed'),
      pendingTasks: tasksData.filter((task) => task.status === 'pending'),
      totalTasks: tasksData.filter((task) => task.status === 'open'),
      failedTasks: tasksData.filter((task) => task.status === 'failed'),
    });
  });
});