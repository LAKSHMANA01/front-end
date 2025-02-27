import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from './Signup';
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('../../utils/apiClient', () => ({
  post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('Signup Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    
    // Mock console.error to prevent test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    console.error.mockRestore();
  });

  const fillFormWithValidData = (getByLabelText) => {
    // Fill in form fields with valid data
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(getByLabelText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(getByLabelText('Pincode'), { target: { value: '123456' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(getByLabelText('Security Question'), { target: { value: 'Pet name?' } });
    fireEvent.change(getByLabelText('Security Answer'), { target: { value: 'Fluffy' } });
    
    // Select role
    const roleSelect = getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'user' } });
  };

  test('renders signup form correctly', () => {
    const { getByLabelText } = render(<Signup />);
    
    // Check form title using h2 element
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    
    // Check if form inputs render properly
    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Phone')).toBeInTheDocument();
    expect(getByLabelText('Address')).toBeInTheDocument();
    expect(getByLabelText('Pincode')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByLabelText('Security Question')).toBeInTheDocument();
    expect(getByLabelText('Security Answer')).toBeInTheDocument();
    expect(getByLabelText('Role')).toBeInTheDocument();
    
    // Verify the Register button exists using button role
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  test('shows validation errors for invalid inputs', async () => {
    const { getByLabelText } = render(<Signup />);
    
    // Enter invalid email
    fireEvent.change(getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.blur(getByLabelText('Email'));
    
    // Enter invalid password
    fireEvent.change(getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.blur(getByLabelText('Password'));
    
    // Check if validation errors are displayed
    expect(screen.getByText('Invalid email format.')).toBeInTheDocument();
    expect(screen.getByText('Password must be 8-15 characters, include uppercase, number & special character.')).toBeInTheDocument();
  });

  test('shows engineer-specific fields when engineer role is selected', () => {
    const { getByLabelText } = render(<Signup />);
    
    // Select engineer role
    const roleSelect = getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'engineer' } });
    
    // Check if engineer-specific fields are displayed
    expect(getByLabelText('Specialization')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByLabelText('Monday')).toBeInTheDocument();
    expect(screen.getByLabelText('Sunday')).toBeInTheDocument();
  });

  test('successfully submits the form with valid user data', async () => {
    // Setup API response
    apiClient.post.mockResolvedValueOnce({});
    
    const { getByLabelText } = render(<Signup />);
    
    // Fill the form with valid data
    fillFormWithValidData(getByLabelText);
    
    // Submit the form using the button role
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verify API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/users/newUser', expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St',
        pincode: '123456',
        password: 'Password123!',
        securityQuestion: 'Pet name?',
        securityAnswer: 'Fluffy',
        role: 'user',
        specialization: null,
        availability: []
      }));
      
      // Verify toast success message
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please log in.');
    });
    
    // Advance timers to trigger setTimeout
    jest.advanceTimersByTime(5000);
    
    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('successfully submits the form with valid engineer data', async () => {
    // Setup API response
    apiClient.post.mockResolvedValueOnce({});
    
    const { getByLabelText } = render(<Signup />);
    
    // Fill the form with valid data
    fillFormWithValidData(getByLabelText);
    
    // Change role to engineer
    const roleSelect = getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'engineer' } });
    
    // Select specialization
    const specializationSelect = getByLabelText('Specialization');
    fireEvent.change(specializationSelect, { target: { value: 'Installation' } });
    
    // Select availability
    const mondayCheckbox = screen.getByLabelText('Monday');
    const wednesdayCheckbox = screen.getByLabelText('Wednesday');
    fireEvent.click(mondayCheckbox);
    fireEvent.click(wednesdayCheckbox);
    
    // Submit the form using button role
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verify API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/users/newUser', expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        role: 'engineer',
        specialization: 'Installation',
        availability: ['Monday', 'Wednesday']
      }));
      
      // Verify toast success message
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Please log in.');
    });
    
    // Advance timers to trigger setTimeout
    jest.advanceTimersByTime(5000);
    
    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('prevents form submission with validation errors', async () => {
    const { getByLabelText } = render(<Signup />);
    
    // Fill most fields but leave email invalid
    fireEvent.change(getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(getByLabelText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(getByLabelText('Pincode'), { target: { value: '123456' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(getByLabelText('Security Question'), { target: { value: 'Pet name?' } });
    fireEvent.change(getByLabelText('Security Answer'), { target: { value: 'Fluffy' } });
    
    // Select role
    const roleSelect = getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'user' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verify error toast was called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors and try again.');
    });
    
    // Verify API was not called
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('handles API error on form submission', async () => {
    // Setup API rejection
    const mockError = new Error('Network error');
    mockError.response = { data: { message: 'Email already exists' } };
    apiClient.post.mockRejectedValueOnce(mockError);
    
    const { getByLabelText } = render(<Signup />);
    
    // Fill the form with valid data
    fillFormWithValidData(getByLabelText);
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verify API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      
      // Verify error toast was called
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
      
      // Verify console.error was called
      expect(console.error).toHaveBeenCalledWith('Signup Error:', 'Email already exists');
    });
  });

  test('handles API error without response data', async () => {
    // Setup API rejection with no response.data.message
    const mockError = new Error('Generic error');
    apiClient.post.mockRejectedValueOnce(mockError);
    
    const { getByLabelText } = render(<Signup />);
    
    // Fill the form with valid data
    fillFormWithValidData(getByLabelText);
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verify API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      
      // Verify error toast was called with default message
      expect(toast.error).toHaveBeenCalledWith('Signup failed. Please try again.');
      
      // Verify console.error was called
      expect(console.error).toHaveBeenCalledWith('Signup Error:', 'Generic error');
    });
  });

  test('renders toast container correctly', () => {
    const { getByTestId } = render(<Signup />);
    
    // Verify toast container is rendered
    expect(getByTestId('toast-container')).toBeInTheDocument();
  });
  
  test('updates form state when inputs change', () => {
    const { getByLabelText } = render(<Signup />);
    
    // Change name input
    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Name' } });
    
    // Verify input value was updated
    expect(getByLabelText('Name').value).toBe('New Name');
  });
  
  test('toggles availability days correctly', () => {
    const { getByLabelText } = render(<Signup />);
    
    // Select engineer role to show availability options
    const roleSelect = getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'engineer' } });
    
    // Click Monday checkbox
    const mondayCheckbox = screen.getByLabelText('Monday');
    fireEvent.click(mondayCheckbox);
    
    // Verify checkbox is checked
    expect(mondayCheckbox).toBeChecked();
    
    // Click Monday checkbox again to uncheck
    fireEvent.click(mondayCheckbox);
    
    // Verify checkbox is unchecked
    expect(mondayCheckbox).not.toBeChecked();
  });
});