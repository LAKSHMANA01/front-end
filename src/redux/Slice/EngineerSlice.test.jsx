import engineerReducer, {
  fetchEngineerTasks,
  fetchAcceptTask,
  fetchRejectTask,
  fetchUpdateEngineerProfile,
  // Assuming fetchEngineerProfiledata is defined in your actual code (not commented out)
  fetchEngineerProfiledata,
  updateTaskStatus,
  HazardsTickets,
  HazardsUpdateTickets,
  HazardsDeleteTickets,
} from './EngineerSlice';

describe('engineerSlice reducer', () => {
  const initialState = {
    tasks: [],
    updateProfile: [],
    profiledata: {},
    Hazards: [],
    loading: false,
    error: null,
  };

  describe('fetchEngineerTasks', () => {
    it('should handle pending', () => {
      const action = { type: fetchEngineerTasks.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled with an array payload', () => {
      const tasks = [{ _id: '1', name: 'Task1' }];
      const action = { type: fetchEngineerTasks.fulfilled.type, payload: tasks };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.tasks).toEqual(tasks);
      expect(state.loading).toBe(false);
    });

    it('should handle fulfilled with a message payload', () => {
      const action = {
        type: fetchEngineerTasks.fulfilled.type,
        payload: { message: 'No tasks available you.' },
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.tasks).toEqual([]);
      expect(state.error).toBe('No tasks available you.');
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchEngineerTasks.rejected.type,
        payload: 'Error fetching tasks',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Error fetching tasks');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchAcceptTask', () => {
    const prevState = {
      ...initialState,
      tasks: [
        { _id: '1', status: 'pending' },
        { _id: '2', status: 'pending' },
      ],
      loading: true,
    };

    it('should handle pending', () => {
      const action = { type: fetchAcceptTask.pending.type };
      const state = engineerReducer(prevState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const updatedTask = { _id: '1', status: 'accepted' };
      const action = {
        type: fetchAcceptTask.fulfilled.type,
        payload: { taskId: '1', updatedTask },
      };
      const state = engineerReducer({ ...prevState, loading: true }, action);
      expect(state.tasks).toContainEqual(updatedTask);
      // Ensure that the other task remains unchanged
      expect(state.tasks).toContainEqual({ _id: '2', status: 'pending' });
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchAcceptTask.rejected.type,
        payload: 'Failed to accept task',
      };
      const state = engineerReducer(prevState, action);
      expect(state.error).toBe('Failed to accept task');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchRejectTask', () => {
    const prevState = {
      ...initialState,
      tasks: [
        { _id: '1', status: 'pending' },
        { _id: '2', status: 'pending' },
      ],
      loading: true,
    };

    it('should handle pending', () => {
      const action = { type: fetchRejectTask.pending.type };
      const state = engineerReducer(prevState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchRejectTask.fulfilled.type,
        payload: { taskId: '1' },
      };
      const state = engineerReducer({ ...prevState, loading: true }, action);
      expect(state.tasks).toEqual([{ _id: '2', status: 'pending' }]);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchRejectTask.rejected.type,
        payload: 'Failed to reject task',
      };
      const state = engineerReducer(prevState, action);
      expect(state.error).toBe('Failed to reject task');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchUpdateEngineerProfile', () => {
    it('should handle pending', () => {
      const action = { type: fetchUpdateEngineerProfile.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const updatedProfile = { email: 'test@example.com', name: 'Test User' };
      const action = {
        type: fetchUpdateEngineerProfile.fulfilled.type,
        payload: updatedProfile,
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.updateProfile).toEqual(updatedProfile);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchUpdateEngineerProfile.rejected.type,
        payload: 'Failed to update engineer profile',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Failed to update engineer profile');
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchEngineerProfiledata', () => {
    it('should handle pending', () => {
      const action = { type: fetchEngineerProfiledata.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const profileData = { email: 'dummy@example.com', name: 'Dummy User' };
      const action = {
        type: fetchEngineerProfiledata.fulfilled.type,
        payload: profileData,
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.updateProfile).toEqual(profileData);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: fetchEngineerProfiledata.rejected.type,
        payload: 'Profile update failed',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Profile update failed');
      expect(state.loading).toBe(false);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status when task exists', () => {
      const prevState = {
        ...initialState,
        tasks: [
          { _id: '1', status: 'pending' },
          { _id: '2', status: 'pending' },
        ],
      };
      const action = {
        type: updateTaskStatus.fulfilled.type,
        payload: { taskId: '1', status: 'completed' },
      };
      const state = engineerReducer(prevState, action);
      expect(state.tasks).toEqual([
        { _id: '1', status: 'completed' },
        { _id: '2', status: 'pending' },
      ]);
    });

    it('should not change tasks if task does not exist', () => {
      const prevState = {
        ...initialState,
        tasks: [{ _id: '1', status: 'pending' }],
      };
      const action = {
        type: updateTaskStatus.fulfilled.type,
        payload: { taskId: '2', status: 'completed' },
      };
      const state = engineerReducer(prevState, action);
      expect(state.tasks).toEqual([{ _id: '1', status: 'pending' }]);
    });

    it('should handle rejected', () => {
      const action = {
        type: updateTaskStatus.rejected.type,
        payload: 'Update failed',
      };
      const state = engineerReducer(initialState, action);
      expect(state.error).toBe('Update failed');
    });
  });

  describe('HazardsTickets', () => {
    it('should handle pending', () => {
      const action = { type: HazardsTickets.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const hazards = [{ _id: 'h1', title: 'Hazard1' }];
      const action = {
        type: HazardsTickets.fulfilled.type,
        payload: hazards,
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.Hazards).toEqual(hazards);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: HazardsTickets.rejected.type,
        payload: 'Hazard fetch error',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Hazard fetch error');
      expect(state.loading).toBe(false);
    });
  });

  describe('HazardsUpdateTickets', () => {
    it('should handle pending', () => {
      const action = { type: HazardsUpdateTickets.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const hazards = [{ _id: 'h2', title: 'Updated Hazard' }];
      const action = {
        type: HazardsUpdateTickets.fulfilled.type,
        payload: hazards,
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.Hazards).toEqual(hazards);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: HazardsUpdateTickets.rejected.type,
        payload: 'Update hazard error',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Update hazard error');
      expect(state.loading).toBe(false);
    });
  });

  describe('HazardsDeleteTickets', () => {
    it('should handle pending', () => {
      const action = { type: HazardsDeleteTickets.pending.type };
      const state = engineerReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const hazards = [{ _id: 'h3', title: 'Remaining Hazard' }];
      const action = {
        type: HazardsDeleteTickets.fulfilled.type,
        payload: hazards,
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.Hazards).toEqual(hazards);
      expect(state.loading).toBe(false);
    });

    it('should handle rejected', () => {
      const action = {
        type: HazardsDeleteTickets.rejected.type,
        payload: 'Delete hazard error',
      };
      const state = engineerReducer({ ...initialState, loading: true }, action);
      expect(state.error).toBe('Delete hazard error');
      expect(state.loading).toBe(false);
    });
  });

  it('should return the initial state when an unknown action is provided', () => {
    const action = { type: 'unknown/action' };
    const state = engineerReducer(initialState, action);
    expect(state).toEqual(initialState);
  });
});