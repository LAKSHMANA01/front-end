import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Mock the child components
jest.mock('./Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="admin-sidebar">Mock Sidebar</div>;
  };
});

jest.mock('./../../compoents/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="admin-navbar">Mock Navbar</div>;
  };
});

describe('AdminLayout Component', () => {
  // Helper function to create a mock store
  const createMockStore = (initialState) => {
    return createStore(() => initialState);
  };

  // Helper function to render with providers
  const renderWithProviders = (component, store) => {
    return render(
      <MemoryRouter>
        <Provider store={store}>{component}</Provider>
      </MemoryRouter>
    );
  };

  test('renders navbar correctly', () => {
    const store = createMockStore({});
    renderWithProviders(<AdminLayout />, store);
    expect(screen.getByTestId('admin-navbar')).toBeInTheDocument();
  });

  test('renders sidebar correctly', () => {
    const store = createMockStore({});
    renderWithProviders(<AdminLayout />, store);
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
  });

  test('renders outlet correctly', () => {
    const store = createMockStore({});
    renderWithProviders(
      <AdminLayout>
        <div data-testid="admin-outlet">Mock Outlet Content</div>
      </AdminLayout>,
      store
    );
    expect(screen.getByTestId('admin-outlet')).toBeInTheDocument();
  });
});