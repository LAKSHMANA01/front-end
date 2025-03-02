import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketForm from './RaiseTicket';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { submitTicket } from '../../redux/Slice/raiseticke';
import { toast } from 'react-toastify';

// --- Mocks --- //

// Mock CustomCard to simply render its children with a title header.
jest.mock('./../../compoents/CustomCard', () => ({ children, title }) => (
  <div data-testid="custom-card">
    <h1>{title}</h1>
    {children}
  </div>
));

// Mock Footer component.
jest.mock('./../../compoents/footers', () => () => <div data-testid="footer">Footer</div>);

// Mock the submitTicket async thunk.
jest.mock('../../redux/Slice/raiseticke', () => ({
  submitTicket: jest.fn(),
}));

// --- Helper functions --- //

// Create a simple mock Redux store.
const createMockStore = (initialState) => createStore(() => initialState);

// Wrap the component with Provider and MemoryRouter.
const renderWithProviders = (component, store) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        {component}
      </Provider>
    </MemoryRouter>
  );
};

describe('TicketForm Component', () => {
  let store;
  let dispatchMock;

  beforeEach(() => {
    // Set sessionStorage values.
    sessionStorage.setItem('email', 'test@example.com');
    sessionStorage.setItem('token', 'dummy-token');

    // Create a mock store with minimal state.
    store = createMockStore({
      Raisetickets: {},
      auth: { user: { name: 'Test User' } },
    });
    // Override dispatch to a jest.fn() so we can simulate async behavior.
    dispatchMock = jest.fn();
    store.dispatch = dispatchMock;
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('renders all form fields and the submit button', () => {
    renderWithProviders(<TicketForm />, store);

    // Check for form labels and input fields.
    expect(screen.getByLabelText(/Service Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Ticket/i })).toBeInTheDocument();

    // Ensure our mocked CustomCard and Footer are rendered.
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('submits the form successfully, dispatches submitTicket, shows success toast, and resets the form', async () => {
    // Simulate a successful dispatch resolution.
    dispatchMock.mockImplementation(() => Promise.resolve({ payload: { id: 1, status: 'submitted' } }));
    // Make submitTicket return an action (its payload will be what we dispatch).
    submitTicket.mockImplementation((data) => ({ type: 'tickets/submitTicket/fulfilled', payload: data }));

    const toastSuccessSpy = jest.spyOn(toast, 'success');
    
    renderWithProviders(<TicketForm />, store);

    // Grab form fields.
    const serviceTypeSelect = screen.getByLabelText(/Service Type/i);
    const addressInput = screen.getByLabelText(/Address/i);
    const descriptionTextarea = screen.getByLabelText(/Description/i);
    const pincodeInput = screen.getByLabelText(/Pincode/i);
    const submitButton = screen.getByRole('button', { name: /Submit Ticket/i });

    // Change form field values.
    fireEvent.change(serviceTypeSelect, { target: { value: 'fault' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });
    fireEvent.change(pincodeInput, { target: { value: '123456' } });

    // Submit the form.
    fireEvent.click(submitButton);

    // Wait for dispatch to be called.
    await waitFor(() =>
      expect(dispatchMock).toHaveBeenCalledWith(
        submitTicket({
          serviceType: 'fault',
          address: '123 Main St',
          description: 'Test description',
          pincode: '123456',
          email: 'test@example.com',
        })
      )
    );

    // Verify that toast.success is called.
    await waitFor(() => expect(toastSuccessSpy).toHaveBeenCalledWith("Ticket submitted successfully!"));

    // Verify that the form fields are reset.
    expect(serviceTypeSelect.value).toBe('installation'); // reset default value
    expect(addressInput.value).toBe('');
    expect(descriptionTextarea.value).toBe('');
    expect(pincodeInput.value).toBe('');
  });

  test('shows an error toast when dispatch fails', async () => {
    // Force dispatch to return a rejected promise.
    dispatchMock.mockImplementation(() => Promise.reject(new Error("Submission failed")));
    
    const toastErrorSpy = jest.spyOn(toast, 'error');

    renderWithProviders(<TicketForm />, store);

    // Fill out the form.
    fireEvent.change(screen.getByLabelText(/Service Type/i), { target: { value: 'fault' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: '123456' } });

    // Submit the form.
    fireEvent.click(screen.getByRole('button', { name: /Submit Ticket/i }));

    // Wait for the error toast to be triggered.
    await waitFor(() => expect(toastErrorSpy).toHaveBeenCalledWith("Failed to submit ticket!"));
  });

  test('shows an error toast if email is not found in sessionStorage', async () => {
    // Remove email from sessionStorage to simulate missing email.
    sessionStorage.removeItem('email');
    const toastErrorSpy = jest.spyOn(toast, 'error');

    renderWithProviders(<TicketForm />, store);

    // Submit the form without filling fields (email check happens first).
    fireEvent.click(screen.getByRole('button', { name: /Submit Ticket/i }));

    await waitFor(() => expect(toastErrorSpy).toHaveBeenCalledWith("User email not found!"));
    // Ensure dispatch is never called.
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});