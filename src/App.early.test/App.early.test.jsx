import React from 'react'
import { BrowserRouter } from "react-router-dom";
import App from '../App';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking components and routes
jest.mock("../page/Home/Homepage", () => () => <div>Homepage</div>);
jest.mock("../page/login/Login", () => () => <div>Login</div>);
jest.mock("../page/login/Signup", () => () => <div>Signup</div>);
jest.mock("../page/login/ForgotPwd", () => () => <div>ForgotPwd</div>);
jest.mock("../utils/logout", () => () => <div>Logout</div>);
jest.mock("../compoents/PageNotFound", () => () => <div>PageNotFound</div>);
jest.mock("../page/user/UserLayout", () => () => <div>UserLayout</div>);
jest.mock("../page/Admin/AdminLayout", () => () => <div>AdminLayout</div>);
jest.mock("../page/Engineer/EngineerDashboard", () => () => <div>EngineerDashboard</div>);
jest.mock("../utils/protectedRoute", () => ({ children }) => <div>{children}</div>);

describe('App() App method', () => {
  describe('Happy Paths', () => {
    it('should render the homepage on the root path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Assert that the homepage is displayed
      expect(screen.getByText('Homepage')).toBeInTheDocument();
    });

    it('should render the login page on the /login path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to /login
      window.history.pushState({}, 'Login Page', '/login');

      // Assert that the login page is displayed
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should render the signup page on the /register path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to /register
      window.history.pushState({}, 'Signup Page', '/register');

      // Assert that the signup page is displayed
      expect(screen.getByText('Signup')).toBeInTheDocument();
    });

    it('should render the forgot password page on the /reset path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to /reset
      window.history.pushState({}, 'Forgot Password Page', '/reset');

      // Assert that the forgot password page is displayed
      expect(screen.getByText('ForgotPwd')).toBeInTheDocument();
    });

    it('should render the logout page on the /logout path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to /logout
      window.history.pushState({}, 'Logout Page', '/logout');

      // Assert that the logout page is displayed
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render the page not found component for an unknown path', () => {
      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to an unknown path
      window.history.pushState({}, 'Unknown Page', '/unknown');

      // Assert that the page not found component is displayed
      expect(screen.getByText('PageNotFound')).toBeInTheDocument();
    });

    it('should render the user layout for a protected user route', () => {
      // Mock the ProtectedRoute to always allow access
      ProtectedRoute.mockImplementation(({ children }) => <div>{children}</div>);

      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to a user route
      window.history.pushState({}, 'User Page', '/User');

      // Assert that the user layout is displayed
      expect(screen.getByText('UserLayout')).toBeInTheDocument();
    });

    it('should render the admin layout for a protected admin route', () => {
      // Mock the ProtectedRoute to always allow access
      ProtectedRoute.mockImplementation(({ children }) => <div>{children}</div>);

      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to an admin route
      window.history.pushState({}, 'Admin Page', '/admin');

      // Assert that the admin layout is displayed
      expect(screen.getByText('AdminLayout')).toBeInTheDocument();
    });

    it('should render the engineer dashboard for a protected engineer route', () => {
      // Mock the ProtectedRoute to always allow access
      ProtectedRoute.mockImplementation(({ children }) => <div>{children}</div>);

      // Render the App component wrapped in BrowserRouter
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Simulate navigation to an engineer route
      window.history.pushState({}, 'Engineer Page', '/engineer');

      // Assert that the engineer dashboard is displayed
      expect(screen.getByText('EngineerDashboard')).toBeInTheDocument();
    });
  });
});