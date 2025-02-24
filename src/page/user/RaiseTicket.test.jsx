import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import TicketForm from './RaiseTicket';
import { submitTicket } from '../../redux/Slice/raiseticke';

// Mock Redux store with middleware
const createMockStore = () =>
  configureStore({
    reducer: {
      Raisetickets: (state = {}) => state,
      auth: (state = { user: {} }) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  });

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock sessionStorage
beforeAll(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn((key) => (key === 'email' ? 'test@example.com' : null)),
      setItem: jest.fn(),
    },
    writable: true,
  });
});

// Mock Redux action
jest.mock('../../redux/Slice/raiseticke', () => ({
  submitTicket: jest.fn(() => async (dispatch) => {
    return Promise.resolve();
  }),
}));

describe('TicketForm Component', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
    jest.clearAllMocks();
  });

  test('renders form and submits successfully', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <TicketForm />
      </Provider>
    );

    // Fill form fields
    fireEvent.change(getByPlaceholderText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(getByPlaceholderText('Describe your issue or request in detail'), { target: { value: 'Test description' } });
    fireEvent.change(getByPlaceholderText('Enter pincode'), { target: { value: '12345' } });

    // Spy on Redux dispatch
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Submit form
    fireEvent.click(getByText('Submit Ticket'));

    // Wait for Redux action to be called
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(submitTicket).toHaveBeenCalledWith({
        serviceType: 'installation',
        address: '123 Main St',
        description: 'Test description',
        pincode: '12345',
        email: 'test@example.com',
      });

      // Ensure toast success message is triggered
      expect(require('react-toastify').toast.success).toHaveBeenCalledWith('Ticket submitted successfully!');
    });
  });
});
