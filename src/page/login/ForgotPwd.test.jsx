import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPwd from './ForgotPwd';
import apiClientUser from '../../utils/apiClientUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('../../utils/apiClientUser');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('ForgotPwd Component', () => {
  let mockNavigate;
  let user;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    user = userEvent.setup();
    //jest.useFakeTimers();
  });

  // Helper function to render component and get common elements
  const setupComponent = () => {
    render(<ForgotPwd />);
    return {
      emailInput: () => screen.getByLabelText(/Enter Email/i),
      submitButton: () => screen.getByRole('button'),
    };
  };

  test('renders initial email verification form', () => {
    setupComponent();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify Email/i })).toBeInTheDocument();
  });

  test('handles email input change', async () => {
    const { emailInput } = setupComponent();
    await act(async () => {
      await user.type(emailInput(), 'test@example.com');
    });
    expect(emailInput().value).toBe('test@example.com');
  });

  test('handles successful email verification and moves to step 2', async () => {
    const { emailInput, submitButton } = setupComponent();
    
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });

    await act(async () => {
      await user.type(emailInput(), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(submitButton());
    });

    await waitFor(() => {
      expect(apiClientUser.post).toHaveBeenCalledWith('/users/reset', { email: 'test@example.com' });
      expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
      expect(screen.getByLabelText(/Security Answer/i)).toBeInTheDocument();
    });
  });

  test('handles failed email verification with API error', async () => {
    const { emailInput, submitButton } = setupComponent();
    
    apiClientUser.post.mockRejectedValueOnce({
      response: { data: { message: 'Email not found' } }
    });

    await act(async () => {
      await user.type(emailInput(), 'nonexistent@example.com');
    });
    
    await act(async () => {
      fireEvent.click(submitButton());
    });

    await waitFor(() => {
      expect(apiClientUser.post).toHaveBeenCalledWith('/users/reset', { email: 'nonexistent@example.com' });
      expect(toast.error).toHaveBeenCalledWith('Email not found');
    });
  });

  test('handles failed email verification with general error', async () => {
    const { emailInput, submitButton } = setupComponent();
    
    apiClientUser.post.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await user.type(emailInput(), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(submitButton());
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error verifying email');
    });
  });

  test('handles security answer verification and moves to step 3', async () => {
    render(<ForgotPwd />);
    
    // Mock first API call for email verification
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });

    // Fill and submit email form
    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });

    // Wait for transition to step 2
    await waitFor(() => {
      expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
    });

    // Mock second API call for security answer verification
    apiClientUser.post.mockResolvedValueOnce({
      data: { success: true }
    });

    // Fill and submit security answer form
    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });

    // Check for transition to step 3
    await waitFor(() => {
      expect(apiClientUser.post).toHaveBeenCalledWith('/users/reset', { 
        email: 'test@example.com', 
        securityAnswer: 'blue' 
      });
      expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });
  });

  test('handles failed security answer verification', async () => {
    render(<ForgotPwd />);
    
    // Mock first API call
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });

    // Fill and submit email form
    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });

    // Wait for transition to step 2
    await waitFor(() => {
      expect(screen.getByText('What is your favorite color?')).toBeInTheDocument();
    });

    // Mock failed security answer verification
    apiClientUser.post.mockRejectedValueOnce({
      response: { data: { message: 'Incorrect answer' } }
    });

    // Fill and submit security answer form
    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'wrong answer');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });

    // Check error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Incorrect answer');
    });
  });

  test('checks password matching during reset', async () => {
    render(<ForgotPwd />);
    
    // Mock API calls to move through steps
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });
    
    // Step 1: Email verification
    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });
    
    await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
    
    // Move to step 3
    apiClientUser.post.mockResolvedValueOnce({
      data: { success: true }
    });
    
    // Step 2: Security answer
    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });
    
    await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
    
    // Fill password fields with different values
    await act(async () => {
      await user.type(screen.getByLabelText(/New Password/i), 'password123');
    });
    
    await act(async () => {
      await user.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    });
    
    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    });
    
    // Check error toast for password mismatch
    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
    expect(apiClientUser.post).toHaveBeenCalledTimes(2); // Only 2 calls so far, not 3
  });

//   test('successfully resets password and navigates to login', async () => {
//     render(<ForgotPwd />);
    
//     // Mock API calls
//     apiClientUser.post.mockResolvedValueOnce({
//       data: {
//         success: true,
//         securityQuestion: 'What is your favorite color?'
//       }
//     });
    
//     // Step 1: Email verification
//     await act(async () => {
//       await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
//     });
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
//     });
    
//     await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
    
//     // Move to step 3
//     apiClientUser.post.mockResolvedValueOnce({
//       data: { success: true }
//     });
    
//     // Step 2: Security answer
//     await act(async () => {
//       await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
//     });
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
//     });
    
//     await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
    
//     // Mock successful password reset
//     apiClientUser.post.mockResolvedValueOnce({
//       data: { success: true }
//     });
    
//     // Fill password fields with matching values
//     await act(async () => {
//       await user.type(screen.getByLabelText(/New Password/i), 'password123');
//     });
    
//     await act(async () => {
//       await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
//     });
    
//     // Submit form
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
//     });
    
//     // Check success toast and navigation
//     await waitFor(() => {
//       expect(apiClientUser.post).toHaveBeenCalledWith('/users/reset', { 
//         email: 'test@example.com', 
//         newPassword: 'password123' 
//       });
//       expect(toast.success).toHaveBeenCalledWith('Password reset successfully!');
//     });
    
//     // Mock timer
//     jest.useFakeTimers();
//     await act(async () => {
//       jest.advanceTimersByTime(2000);
//     });
    
//     expect(mockNavigate).toHaveBeenCalledWith('/login');
//     jest.useRealTimers();
//   });

// test('successfully resets password and navigates to login', async () => {
//     render(<ForgotPwd />);
//     apiClientUser.post.mockResolvedValueOnce({
//       data: { success: true, securityQuestion: 'What is your favorite color?' }
//     });

//     await act(async () => {
//       await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
//       fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
//     });

//     await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
//     apiClientUser.post.mockResolvedValueOnce({ data: { success: true } });

//     await act(async () => {
//       await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
//       fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
//     });

//     await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
//     apiClientUser.post.mockResolvedValueOnce({ data: { success: true } });

//     await act(async () => {
//       await user.type(screen.getByLabelText(/New Password/i), 'password123');
//       await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
//       fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
//     });

//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith('Password reset successfully!');
//     });

//     await act(async () => {
//       jest.advanceTimersByTime(2000);
//     });

//     expect(mockNavigate).toHaveBeenCalledWith('/login');
//   });

test('successfully resets password and navigates to login', async () => {
    render(<ForgotPwd />);
    apiClientUser.post.mockResolvedValueOnce({
      data: { success: true, securityQuestion: 'What is your favorite color?' }
    });

    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });

    await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
    apiClientUser.post.mockResolvedValueOnce({ data: { success: true } });

    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });

    await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
    apiClientUser.post.mockResolvedValueOnce({ data: { success: true } });

    await act(async () => {
      await user.type(screen.getByLabelText(/New Password/i), 'password123');
      await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Password reset successfully!');
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('handles failed password reset', async () => {
    render(<ForgotPwd />);
    
    // Mock API calls
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });
    
    // Step 1
    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });
    
    await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
    
    // Step 2
    apiClientUser.post.mockResolvedValueOnce({
      data: { success: true }
    });
    
    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });
    
    await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
    
    // Mock failed password reset
    apiClientUser.post.mockRejectedValueOnce({
      response: { data: { message: 'Password reset failed' } }
    });
    
    // Fill password fields
    await act(async () => {
      await user.type(screen.getByLabelText(/New Password/i), 'password123');
    });
    
    await act(async () => {
      await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    });
    
    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    });
    
    // Check error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Password reset failed');
    });
  });

  test('handles failed reset with server error', async () => {
    render(<ForgotPwd />);
    
    // Mock API calls
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: true,
        securityQuestion: 'What is your favorite color?'
      }
    });
    
    // Step 1
    await act(async () => {
      await user.type(screen.getByLabelText(/Enter Email/i), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
    });
    
    await waitFor(() => expect(screen.getByText('What is your favorite color?')).toBeInTheDocument());
    
    // Step 2
    apiClientUser.post.mockResolvedValueOnce({
      data: { success: true }
    });
    
    await act(async () => {
      await user.type(screen.getByLabelText(/Security Answer/i), 'blue');
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Verify Answer/i }));
    });
    
    await waitFor(() => expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument());
    
    // Mock server error (no response data)
    apiClientUser.post.mockRejectedValueOnce(new Error('Server error'));
    
    // Fill password fields
    await act(async () => {
      await user.type(screen.getByLabelText(/New Password/i), 'password123');
    });
    
    await act(async () => {
      await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    });
    
    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    });
    
    // Check generic error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error resetting password');
    });
  });

  test('handles API success but with error message', async () => {
    const { emailInput, submitButton } = setupComponent();
    
    apiClientUser.post.mockResolvedValueOnce({
      data: {
        success: false,
        message: 'Email not registered'
      }
    });

    await act(async () => {
      await user.type(emailInput(), 'test@example.com');
    });
    
    await act(async () => {
      fireEvent.click(submitButton());
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email not registered');
    });
  });
});