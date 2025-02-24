import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ToastContainer } from 'react-toastify';
import AdminHazardsTickets from './AdminHazardsTickets';
import { MemoryRouter } from 'react-router-dom';

// Mock Redux dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

// Mock Redux slice action
jest.mock('../../redux/Slice/raiseticke', () => ({
  HazardsTicket: jest.fn(() => Promise.resolve()),
}));

describe('AdminHazardsTickets Component', () => {
  const createMockStore = (initialState) => createStore(() => initialState);

  const renderWithProviders = (component, store) => {
    return render(
      <MemoryRouter>
        <Provider store={store}>
          {component}
          <ToastContainer />
        </Provider>
      </MemoryRouter>
    );
  };

  test('renders form correctly', () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    expect(screen.getByPlaceholderText('Hazard Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe hazard in detail')).toBeInTheDocument();
    expect(screen.getByText('Submit Hazard')).toBeInTheDocument();
  });

  test('updates form fields correctly', async () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Hazard Title'), { target: { value: 'Test Hazard' } });
      fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: 'Test Address' } });
      fireEvent.change(screen.getByPlaceholderText('Describe hazard in detail'), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByRole('combobox', { name: 'Priority Level' }), { target: { value: 'high' } });
      fireEvent.change(screen.getByLabelText('Enter pin Code'), { target: { value: '123456' } });
    });

    expect(screen.getByPlaceholderText('Hazard Title').value).toBe('Test Hazard');
    expect(screen.getByPlaceholderText('Address').value).toBe('Test Address');
    expect(screen.getByPlaceholderText('Describe hazard in detail').value).toBe('Test Description');
    expect(screen.getByRole('combobox', { name: 'Priority Level' }).value).toBe('high');
    expect(screen.getByLabelText('Enter pin Code').value).toBe('123456');
  });

  test('submits the form and resets fields on success', async () => {
    const store = createMockStore({});
    renderWithProviders(<AdminHazardsTickets />, store);

    const titleInput = screen.getByPlaceholderText('Hazard Title');
    const addressInput = screen.getByPlaceholderText('Address');
    const descriptionInput = screen.getByPlaceholderText('Describe hazard in detail');
    const riskLevelSelect = screen.getByRole('combobox', { name: 'Priority Level' });
    const pincodeInput = screen.getByLabelText('Enter pin Code');
    const submitButton = screen.getByText('Submit Hazard');

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test Hazard' } });
      fireEvent.change(addressInput, { target: { value: 'Test Address' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.change(riskLevelSelect, { target: { value: 'high' } });
      fireEvent.change(pincodeInput, { target: { value: '123456' } });
      fireEvent.click(submitButton);
    });

    expect(titleInput.value).toBe('');
    expect(addressInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
    expect(riskLevelSelect.value).toBe('medium'); // Assuming 'medium' is the default
    expect(pincodeInput.value).toBe('');
  });
});