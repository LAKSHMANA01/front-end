// App.test.jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/Slice/authSlice';
import { MemoryRouter } from 'react-router-dom';

// Mock all child components
jest.mock('./page/Home/Homepage', () => () => <div data-testid="homepage">Homepage</div>);
jest.mock('./page/login/Login', () => () => <div data-testid="login">Login</div>);
jest.mock('./page/login/Signup', () => () => <div data-testid="signup">Signup</div>);
jest.mock('./page/login/ForgotPwd', () => () => <div data-testid="forgot-pwd">Forgot Password</div>);
jest.mock('./page/Admin/AdminLayout', () => ({ children }) => <div data-testid="admin-layout">{children}</div>);
jest.mock('./page/user/UserLayout', () => ({ children }) => <div data-testid="user-layout">{children}</div>);
jest.mock('./page/Engineer/EngineerDashboard', () => ({ children }) => <div data-testid="engineer-dashboard">{children}</div>);
jest.mock('./utils/protectedRoute', () => ({ children, allowedRoles }) => (
  <div data-testid="protected-route" data-roles={allowedRoles.join(',')}>
    {children}
  </div>
));

// Create a mock store factory
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        role: null,
        ...initialState
      }
    }
  });
};

// Test wrapper component
const renderWithProviders = (ui, { route = '/', initialState = {} } = {}) => {
  const store = createMockStore(initialState);
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders homepage by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('homepage')).toBeInTheDocument();
  });

  test('renders login page on /login route', () => {
    renderWithProviders(<App />, { route: '/login' });
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  test('renders signup page on /register route', () => {
    renderWithProviders(<App />, { route: '/register' });
    expect(screen.getByTestId('signup')).toBeInTheDocument();
  });

  test('renders forgot password page on /reset route', () => {
    renderWithProviders(<App />, { route: '/reset' });
    expect(screen.getByTestId('forgot-pwd')).toBeInTheDocument();
  });

  test('protects admin routes with correct role', () => {
    renderWithProviders(<App />, { route: '/admin' });
    const protectedRoute = screen.getByTestId('protected-route');
    expect(protectedRoute).toHaveAttribute('data-roles', 'admin');
  });

  test('protects user routes with correct role', () => {
    renderWithProviders(<App />, { route: '/User' });
    const protectedRoute = screen.getByTestId('protected-route');
    expect(protectedRoute).toHaveAttribute('data-roles', 'user');
  });

  test('protects engineer routes with correct role', () => {
    renderWithProviders(<App />, { route: '/engineer' });
    const protectedRoute = screen.getByTestId('protected-route');
    expect(protectedRoute).toHaveAttribute('data-roles', 'engineer');
  });

  test('renders 404 page for unknown routes', () => {
    renderWithProviders(<App />, { route: '/unknown-route' });
    expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
  });

  // Test authenticated user scenarios
  test('allows authenticated admin access to admin routes', () => {
    renderWithProviders(<App />, {
      route: '/admin',
      initialState: {
        isAuthenticated: true,
        role: 'admin'
      }
    });
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  test('allows authenticated user access to user routes', () => {
    renderWithProviders(<App />, {
      route: '/User',
      initialState: {
        isAuthenticated: true,
        role: 'user'
      }
    });
    expect(screen.getByTestId('user-layout')).toBeInTheDocument();
  });

  test('allows authenticated engineer access to engineer routes', () => {
    renderWithProviders(<App />, {
      route: '/engineer',
      initialState: {
        isAuthenticated: true,
        role: 'engineer'
      }
    });
    expect(screen.getByTestId('engineer-dashboard')).toBeInTheDocument();
  });
});