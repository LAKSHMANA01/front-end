import { configureStore } from '@reduxjs/toolkit';
import ticketReducer, { submitTicket, HazardsTicket } from './raiseticke';
import apiClient from '../../utils/apiClient';
import axios from 'axios';

// Mock the modules
jest.mock('../../utils/apiClient', () => ({
  post: jest.fn()
}));
jest.mock('axios');

describe('ticketSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tickets: ticketReducer
      }
    });
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test cases for submitTicket
  describe('submitTicket', () => {
    const mockTicketData = {
      email: 'test@example.com',
      title: 'Test Ticket',
      description: 'Test Description'
    };

    test('should handle pending state', () => {
      store.dispatch(submitTicket(mockTicketData));
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    test('should handle fulfilled state', async () => {
      const mockResponse = { id: 1, ...mockTicketData };
      apiClient.post.mockResolvedValueOnce({ data: mockResponse });

      await store.dispatch(submitTicket(mockTicketData));
      
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(false);
      expect(state.data).toContainEqual(mockResponse);
      expect(state.isError).toBe(false);
    });

    test('should handle rejected state', async () => {
      const errorMessage = 'Network Error';
      apiClient.post.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(submitTicket(mockTicketData));
      
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toBe(errorMessage);
    });
  });

  // Test cases for HazardsTicket
  describe('HazardsTicket', () => {
    const mockHazardData = {
      title: 'Test Hazard',
      description: 'Hazard Description'
    };

    test('should handle pending state', () => {
      store.dispatch(HazardsTicket(mockHazardData));
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    test('should handle fulfilled state', async () => {
      const mockResponse = { id: 1, ...mockHazardData };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      await store.dispatch(HazardsTicket(mockHazardData));
      
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(false);
      expect(state.HazardsRisetickes).toContainEqual(mockResponse);
      expect(state.isError).toBe(false);
    });

    test('should handle rejected state', async () => {
      const errorMessage = 'Server Error';
      axios.post.mockRejectedValueOnce({
        response: { data: errorMessage }
      });

      await store.dispatch(HazardsTicket(mockHazardData));
      
      const state = store.getState().tickets;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toBe(errorMessage);
    });
  });
});