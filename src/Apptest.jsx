import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  test('renders Homepage component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('renders Login component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders Signup component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  });

  test('renders ForgotPwd component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  });

  test('renders PagaeNotFound component for unknown routes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  test('renders UserLayout component for user routes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
  });

  test('renders AdminLayout component for admin routes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  test('renders EngineerDashboard component for engineer routes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Engineer Dashboard/i)).toBeInTheDocument();
  });
});