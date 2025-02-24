import { configureStore } from '@reduxjs/toolkit';
import taskReducer, { fetchTasks, clearError, clearTasks } from './taskSlice';
import apiClient from '../../utils/apiClient';

// Mock the apiClient
jest.mock('../../utils/apiClient', () => ({
  get: jest.fn()
}));

describe('taskSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: taskReducer
      }
    });
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    test('should handle initial state', () => {
      const state = store.getState().tasks;
      expect(state.tasks).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('should handle pending state', () => {
      store.dispatch(fetchTasks());
      const state = store.getState().tasks;
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    test('should handle successful fetch', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' }
      ];
      
      apiClient.get.mockResolvedValueOnce({ data: mockTasks });

      await store.dispatch(fetchTasks());
      
      const state = store.getState().tasks;
      expect(apiClient.get).toHaveBeenCalledWith('/admin/tasks');
      expect(state.tasks).toEqual(mockTasks);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch tasks';
      apiClient.get.mockRejectedValueOnce({
        response: { data: errorMessage }
      });

      await store.dispatch(fetchTasks());
      
      const state = store.getState().tasks;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.tasks).toEqual([]);
    });

    test('should handle network error', async () => {
      const errorMessage = 'Network Error';
      apiClient.get.mockRejectedValueOnce(new Error(errorMessage));

      await store.dispatch(fetchTasks());
      
      const state = store.getState().tasks;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.tasks).toEqual([]);
    });
  });

  describe('synchronous actions', () => {
    test('should clear error state', () => {
      // First set an error
      store = configureStore({
        reducer: {
          tasks: taskReducer
        },
        preloadedState: {
          tasks: {
            error: 'Some error',
            loading: false,
            tasks: []
          }
        }
      });

      store.dispatch(clearError());
      const state = store.getState().tasks;
      expect(state.error).toBe(null);
    });

    test('should clear tasks', () => {
      // First set some tasks
      store = configureStore({
        reducer: {
          tasks: taskReducer
        },
        preloadedState: {
          tasks: {
            tasks: [{ id: 1, title: 'Task 1' }],
            loading: false,
            error: null
          }
        }
      });

      store.dispatch(clearTasks());
      const state = store.getState().tasks;
      expect(state.tasks).toEqual([]);
    });
  });

  describe('error handling', () => {
    test('should handle server error with specific message', async () => {
      const errorMessage = 'Internal Server Error';
      apiClient.get.mockRejectedValueOnce({
        response: { data: errorMessage }
      });

      await store.dispatch(fetchTasks());
      
      const state = store.getState().tasks;
      expect(state.error).toBe(errorMessage);
    });

    test('should handle error with no response data', async () => {
      apiClient.get.mockRejectedValueOnce({});

      await store.dispatch(fetchTasks());
      
      const state = store.getState().tasks;
      expect(state.error).toBeDefined();
    });
  });
});