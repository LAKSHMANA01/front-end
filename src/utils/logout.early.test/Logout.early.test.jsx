import React from 'react'
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from './apiClient';
import Logout from '../logout';

// Mock the necessary modules
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../apiClient", () => ({
  post: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div>Mocked ToastContainer</div>,
}));

describe('Logout() Logout method', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    sessionStorage.clear();
    localStorage.clear();
  });

  // Happy Path: Successful logout
  it('should successfully log out the user and navigate to login page', async () => {
    apiClient.post.mockResolvedValueOnce({});

    render(<Logout />);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/users/logout');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
      expect(navigateMock).toHaveBeenCalledWith('/login');
    });
  });

  // Edge Case: API call fails
  it('should handle API failure gracefully and show error toast', async () => {
    const errorMessage = 'Network Error';
    apiClient.post.mockRejectedValueOnce(new Error(errorMessage));

    render(<Logout />);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/users/logout');
      expect(toast.error).toHaveBeenCalledWith('Failed to logout. Please try again.');
    });
  });

  // Edge Case: Check if storage is cleared even if API fails
  it('should clear storage even if API call fails', async () => {
    apiClient.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<Logout />);

    await waitFor(() => {
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  // Edge Case: Ensure toast container is rendered
  it('should render the ToastContainer', () => {
    const { getByText } = render(<Logout />);
    expect(getByText('Mocked ToastContainer')).toBeInTheDocument();
  });
});