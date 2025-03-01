import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import AdminDeferredTasks from './AdminDeferredTasks';

// Mock the child components
jest.mock('./NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="admin-navbar">Mock NavBar</div>;
  };
});

jest.mock('./AdminTaskCard', () => {
  return function MockTaskCard({ task }) {
    return <div data-testid="admin-task-card">{task.title}</div>;
  };
});

jest.mock('../../compoents/Loadingpage', () => {
  return function MockLoading() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock Redux dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('AdminDeferredTasks Component', () => {
  // Helper function to create a mock store
  const createMockStore = (initialState) => {
    return createStore(() => initialState);
  };

  // Helper function to render with providers
  const renderWithProviders = (component, store) => {
    return render(
      <MemoryRouter>
        <Provider store={store}>
          {component}
        </Provider>
      </MemoryRouter>
    );
  };

  test('renders loading state correctly', () => {
    const store = createMockStore({
      admin: {
        deferredTasks: [],
        loading: true,
        error: null,
      }
    });

    renderWithProviders(<AdminDeferredTasks />, store);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const store = createMockStore({
      admin: {
        deferredTasks: [],
        loading: false,
        error: 'Failed to fetch tasks',
      }
    });

    renderWithProviders(<AdminDeferredTasks />, store);
    expect(screen.getByText('Error: Failed to fetch tasks')).toBeInTheDocument();
  });

  test('renders empty state when no deferred tasks', () => {
    const store = createMockStore({
      admin: {
        deferredTasks: [],
        loading: false,
        error: null,
      }
    });

    renderWithProviders(<AdminDeferredTasks />, store);
    expect(screen.getByText('No deferred tasks available.')).toBeInTheDocument();
  });

  test('renders deferred tasks correctly', () => {
    const store = createMockStore({
      admin: {
        deferredTasks: [
          { id: '1', title: 'Task 1', status: 'deferred' },
          { id: '2', title: 'Task 2', status: 'pending' },
          { id: '3', title: 'Task 3', status: 'deferred' }
        ],
        loading: false,
        error: null,
      }
    });

    renderWithProviders(<AdminDeferredTasks />, store);

    // Should render NavBar
    expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();

    // Should render only deferred tasks (3 in our mock data)
    const taskCards = screen.getAllByTestId('admin-task-card');
    expect(taskCards).toHaveLength(3);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('dispatches fetchDeferredTasks on mount', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const store = createMockStore({
      admin: {
        deferredTasks: [],
        loading: false,
        error: null,
      }
    });

    renderWithProviders(<AdminDeferredTasks />, store);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
