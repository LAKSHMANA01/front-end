import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import AdminHazards from './AdminHazards';

// Mock the Redux actions
jest.mock('../../redux/Slice/EngineerSlice', () => ({
  HazardsTickets: jest.fn(),
  HazardsUpdateTickets: jest.fn(),
  HazardsDeleteTickets: jest.fn()
}));

// Mock Redux dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('AdminHazards Component', () => {
  // Helper function to create a mock store
  const createMockStore = (initialState) => {
    return createStore(() => initialState);
  };

  // Helper function to render with providers
  const renderWithProviders = (component, store) => {
    return render(
      <MemoryRouter>
        <Provider store={store}>{component}</Provider>
      </MemoryRouter>
    );
  };

  test('renders empty state when no hazards are available', () => {
    const store = createMockStore({
      engineer: {
        Hazards: [],
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<AdminHazards />, store);
    expect(screen.getByText('Hazards not founds')).toBeInTheDocument();
  });

  test('renders hazards correctly', () => {
    const store = createMockStore({
      engineer: {
        Hazards: [
          { _id: '1', hazardType: 'Fire', description: 'Fire hazard', riskLevel: 'high', pincode: '560001' },
          { _id: '2', hazardType: 'Gas Leak', description: 'Gas leak detected', riskLevel: 'medium', pincode: '560002' }
        ],
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<AdminHazards />, store);

    expect(screen.getByText('Harzard : Fire')).toBeInTheDocument();
    expect(screen.getByText('Harzard : Gas Leak')).toBeInTheDocument();
  });

  test('opens and closes hazard details modal', () => {
    const store = createMockStore({
      engineer: {
        Hazards: [
          { _id: '1', hazardType: 'Fire', description: 'Fire hazard', riskLevel: 'high', pincode: '560001' }
        ],
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<AdminHazards />, store);
    fireEvent.click(screen.getByText('Harzard : Fire'));
    expect(screen.getByText('Fire')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText('Fire')).not.toBeInTheDocument();
  });

  test('dispatches fetchAllHazards on mount', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const store = createMockStore({
      engineer: {
        Hazards: [],
        loading: false,
        error: null,
      },
    });

    renderWithProviders(<AdminHazards />, store);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
