import { configureStore } from '@reduxjs/toolkit';
import ticketReducer, {
  fetchTickets,
  fetchProfile,
  fetchUpdateProfile
} from './UserSlice';
import apiClient from '../../utils/apiClient';

jest.mock('../../utils/apiClient');

describe('ticketSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tickets: ticketReducer
      }
    });
    jest.clearAllMocks();
  });

  describe('fetchTickets', () => {
    const mockTasks = [{ id: 1, title: 'Test Ticket' }];
    const userData = { userEmail: 'test@example.com', role: 'user' };

    test('should handle pending state', () => {
      store.dispatch(fetchTickets(userData));
      const state = store.getState().tickets;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle fulfilled state', async () => {
      apiClient.get.mockResolvedValueOnce({ data: mockTasks });
      await store.dispatch(fetchTickets(userData));
      
      const state = store.getState().tickets;
      expect(apiClient.get).toHaveBeenCalledWith('/tasks/user/test@example.com');
      expect(state.tasks).toEqual(mockTasks);
      expect(state.loading).toBe(false);
    });

    test('should handle rejected state', async () => {
      const errorMessage = 'Failed to fetch tickets';
      apiClient.get.mockRejectedValueOnce({ 
        response: { data: errorMessage } 
      });
      
      await store.dispatch(fetchTickets(userData));
      const state = store.getState().tickets;
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchProfile', () => {
    const mockProfile = { name: 'John Doe', email: 'test@example.com' };
    const userData = { userEmail: 'test@example.com', role: 'user' };

    test('should handle pending state', () => {
      store.dispatch(fetchProfile(userData));
      const state = store.getState().tickets;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle fulfilled state', async () => {
      apiClient.get.mockResolvedValueOnce({ data: mockProfile });
      await store.dispatch(fetchProfile(userData));
      
      const state = store.getState().tickets;
      expect(state.profile).toEqual(mockProfile);
      expect(state.loading).toBe(false);
    });

    test('should handle rejected state', async () => {
      const errorMessage = 'Profile not found';
      apiClient.get.mockRejectedValueOnce({
        response: { data: errorMessage }
      });
      
      await store.dispatch(fetchProfile(userData));
      const state = store.getState().tickets;
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchUpdateProfile', () => {
    const mockUpdateData = { name: 'Updated Name' };
    const userData = {
      userEmail: 'test@example.com',
      role: 'user',
      updatedata: mockUpdateData
    };

    test('should handle pending state', () => {
      store.dispatch(fetchUpdateProfile(userData));
      const state = store.getState().tickets;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle fulfilled state', async () => {
      const mockResponse = { ...userData, ...mockUpdateData };
      apiClient.patch.mockResolvedValueOnce({ data: mockResponse });
      
      await store.dispatch(fetchUpdateProfile(userData));
      const state = store.getState().tickets;
      expect(state.updateProfile).toEqual(mockResponse);
      expect(state.loading).toBe(false);
    });

    test('should handle rejected state', async () => {
      const errorMessage = 'Update failed';
      apiClient.patch.mockRejectedValueOnce({
        response: { data: errorMessage }
      });
      
      await store.dispatch(fetchUpdateProfile(userData));
      const state = store.getState().tickets;
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    test('should handle network errors', async () => {
      apiClient.patch.mockRejectedValueOnce(new Error('Network Error'));
      await store.dispatch(fetchUpdateProfile(userData));
      
      const state = store.getState().tickets;
      expect(state.error).toBe('Failed to update profile');
      expect(state.loading).toBe(false);
    });
  });

  describe('state transitions', () => {
    test('should reset error on new request', async () => {
      // First create an error state
      apiClient.get.mockRejectedValueOnce({ 
        response: { data: 'Initial error' } 
      });
      await store.dispatch(fetchTickets({
        userEmail: 'test@example.com',
        role: 'user'
      }));
      
      // New request should reset error
      store.dispatch(fetchTickets({
        userEmail: 'test@example.com',
        role: 'user'
      }));
      
      const state = store.getState().tickets;
      expect(state.error).toBeNull();
      expect(state.loading).toBe(true);
    });
  });
});