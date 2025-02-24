import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import AdminHazards from './AdminHazards';
import { HazardsTickets, HazardsUpdateTickets, HazardsDeleteTickets } from '../../redux/Slice/EngineerSlice';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock Redux dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn().mockImplementation((action) => action),
  useSelector: jest.fn(),
}));

// Mock the EngineerDashBoard component
jest.mock('../Engineer/Hazards', () => {
  return function MockEngineerDashBoard() {
    return <div data-testid="engineer-dashboard">Mock Engineer Dashboard</div>;
  };
});

describe('AdminHazards Component', () => {
  // Mock data
  const mockHazards = [
    {
      _id: '1',
      hazardType: 'Electrical',
      description: 'Exposed wiring near water source',
      riskLevel: 'high',
      address: '123 Main St',
      pincode: '12345',
    },
    {
      _id: '2',
      hazardType: 'Chemical',
      description: 'Improper storage of flammable materials',
      riskLevel: 'medium',
      address: '456 Oak Ave',
      pincode: '67890',
    },
    {
      _id: '3',
      hazardType: 'Structural',
      description: 'Weak support beams',
      riskLevel: 'low',
      address: '789 Pine Rd',
      pincode: '54321',
    },
  ];

  // Helper function to render with providers
  const renderWithProviders = (ui, reduxState) => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => selector(reduxState));
    
    return render(
      <MemoryRouter>
        <Provider store={createStore(() => ({}))}>
          {ui}
        </Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state correctly', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: [],
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('Hazards Tasks')).toBeInTheDocument();
    expect(screen.getByText('Hazards not founds')).toBeInTheDocument();
  });

  test('dispatches HazardsTickets on mount', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: [],
        loading: false,
        error: null,
      },
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('renders hazard cards correctly', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText('Hazards Tasks')).toBeInTheDocument();
    expect(screen.getByText('Harzard : Electrical')).toBeInTheDocument();
    expect(screen.getByText('Harzard : Chemical')).toBeInTheDocument();
    expect(screen.getByText('Harzard : Structural')).toBeInTheDocument();
  });

  test('search functionality filters hazards correctly', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    const searchInput = screen.getByPlaceholderText('Search by hazard type');
    fireEvent.change(searchInput, { target: { value: '12345' } });

    expect(screen.getByText('Harzard : Electrical')).toBeInTheDocument();
    expect(screen.queryByText('Harzard : Chemical')).not.toBeInTheDocument();
  });

  test('clicking on hazard card opens modal', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    const hazardCard = screen.getByText('Harzard : Electrical').closest('div');
    fireEvent.click(hazardCard);

    expect(screen.getByText('Exposed wiring near water source')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Pincode: 12345')).toBeInTheDocument();
  });

  test('update button in modal opens update form', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    // Click on hazard card to open modal
    const hazardCard = screen.getByText('Harzard : Electrical').closest('div');
    fireEvent.click(hazardCard);

    // Click on update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    // Check if update form is open
    expect(screen.getByText('Update Hazard')).toBeInTheDocument();
    
    // Check if form fields are pre-populated
    const hazardTypeInput = screen.getByPlaceholderText('Hazard Type');
    expect(hazardTypeInput.value).toBe('Electrical');
  });

  test('submitting update form dispatches HazardsUpdateTickets', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    // Click on hazard card to open modal
    const hazardCard = screen.getByText('Harzard : Electrical').closest('div');
    fireEvent.click(hazardCard);

    // Click on update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    // Modify form data
    const hazardTypeInput = screen.getByPlaceholderText('Hazard Type');
    fireEvent.change(hazardTypeInput, { target: { value: 'Updated Electrical' } });

    // Submit form
    const submitButton = screen.getByText('Update');
    fireEvent.click(submitButton);

    // Check if HazardsUpdateTickets was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  test('delete button dispatches HazardsDeleteTickets and shows toast', () => {
    const mockDispatch = jest.fn();
    const { toast } = require('react-toastify');
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    // Click on hazard card to open modal
    const hazardCard = screen.getByText('Harzard : Electrical').closest('div');
    fireEvent.click(hazardCard);

    // Click on update button to get to the update modal
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    // Click delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Check if HazardsDeleteTickets was dispatched and toast shown
    expect(mockDispatch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Hazards deleted successfully!");
  });

  test('correctly applies hazard styles based on risk level', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    // We'll check the class names of the hazard cards which should include the background color classes
    const highRiskCard = screen.getByText('Harzard : Electrical').closest('div');
    const mediumRiskCard = screen.getByText('Harzard : Chemical').closest('div');
    const lowRiskCard = screen.getByText('Harzard : Structural').closest('div');

    expect(highRiskCard.className).toContain('bg-red-200');
    expect(mediumRiskCard.className).toContain('bg-orange-200');
    expect(lowRiskCard.className).toContain('bg-yellow-200');
  });

  test('renders toast container', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('handles input changes in update form', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    // Click on hazard card to open modal
    const hazardCard = screen.getByText('Harzard : Electrical').closest('div');
    fireEvent.click(hazardCard);

    // Click on update button
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    // Modify form fields
    const hazardTypeInput = screen.getByPlaceholderText('Hazard Type');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const riskLevelSelect = screen.getByDisplayValue('high');
    const addressInput = screen.getByPlaceholderText('Address');
    const pincodeInput = screen.getByPlaceholderText('Pincode');

    fireEvent.change(hazardTypeInput, { target: { value: 'Updated Electrical' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
    fireEvent.change(riskLevelSelect, { target: { value: 'medium' } });
    fireEvent.change(addressInput, { target: { value: 'Updated address' } });
    fireEvent.change(pincodeInput, { target: { value: '54321' } });

    // Check if values were updated
    expect(hazardTypeInput.value).toBe('Updated Electrical');
    expect(descriptionInput.value).toBe('Updated description');
    expect(riskLevelSelect.value).toBe('medium');
    expect(addressInput.value).toBe('Updated address');
    expect(pincodeInput.value).toBe('54321');
  });

  test('add hazards button links to correct route', () => {
    renderWithProviders(<AdminHazards />, {
      engineer: {
        Hazards: mockHazards,
        loading: false,
        error: null,
      },
    });

    const addButton = screen.getByText('Add Hazards');
    expect(addButton.closest('a')).toHaveAttribute('href', '/admin/hazardsTickets');
  });
});