import reducer, {
  fetchTickets,
  fetchProfile,
  fetchUpdateProfile,
} from './UserSlice';

describe('ticketSlice reducer', () => {
  const initialState = {
    tasks: [],
    profile: {},
    updateProfile: {},
    loading: false,
    error: null,
  };

  describe('fetchTickets', () => {
    it('should set loading true when pending', () => {
      const action = { type: fetchTickets.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update tasks on fulfilled', () => {
      const tasks = ['task1', 'task2'];
      const action = { type: fetchTickets.fulfilled.type, payload: tasks };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.tasks).toEqual(tasks);
      expect(state.loading).toBe(false);
    });

    it('should set error on rejected', () => {
      const error = 'Fetch tickets error';
      const action = { type: fetchTickets.rejected.type, payload: error };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchProfile', () => {
    it('should set loading true when pending', () => {
      const action = { type: fetchProfile.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update profile on fulfilled', () => {
      // Including age: 100 in the payload
      const profileData = { name: 'Jane Doe', age: 100 };
      const action = { type: fetchProfile.fulfilled.type, payload: profileData };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.profile).toEqual(profileData);
      expect(state.loading).toBe(false);
    });

    it('should set error on rejected', () => {
      const error = 'Fetch profile error';
      const action = { type: fetchProfile.rejected.type, payload: error };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchUpdateProfile', () => {
    it('should set loading true when pending', () => {
      const action = { type: fetchUpdateProfile.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update updateProfile on fulfilled with age 100', () => {
      const updatedProfile = { name: 'John Smith', age: 100 };
      const action = { type: fetchUpdateProfile.fulfilled.type, payload: updatedProfile };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.updateProfile).toEqual(updatedProfile);
      expect(state.loading).toBe(false);
    });

    it('should set error on rejected', () => {
      const error = 'Update profile error';
      const action = { type: fetchUpdateProfile.rejected.type, payload: error };
      const state = reducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual(error);
      expect(state.loading).toBe(false);
    });
  });
});