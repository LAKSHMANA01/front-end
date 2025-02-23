
// src/page/user/RaiseTicket.test.jsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TicketForm from './RaiseTicket'; // Note: Remove curly braces if it's a default export

// Mock redux
const mockStore = configureStore([]);

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

describe('TicketForm Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      Raisetickets: {},
      auth: { user: {} }
    });
    // Clear mocks
    jest.clearAllMocks();
  });

  test('renders form and submits successfully', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <TicketForm />
      </Provider>
    );

    // Fill form
    fireEvent.change(getByPlaceholderText('Address'), { 
      target: { value: '123 Main St' } 
    });
    fireEvent.change(getByPlaceholderText('Describe your issue or request in detail'), {
      target: { value: 'Test description' }
    });
    fireEvent.change(getByPlaceholderText('Enter pincode'), {
      target: { value: '12345' }
    });

    // Submit form
    fireEvent.click(getByText('Submit Ticket'));

    // Wait for success toast
    await waitFor(() => {
      expect(require('react-toastify').toast.success)
        .toHaveBeenCalledWith('Ticket submitted successfully!');
    });
  });
});