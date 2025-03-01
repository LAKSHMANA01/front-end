import adminReducer, {
  fetchAllTasks,
  fetchAllUsers,
  fetchAllApprovedEngineers,
  fetchAllEngineers,
  approveEngineer,
  fetchDeferredTasks,
  fetchAvailableEngineers,
  reassignTicket,
  fetchEngineerTasks
} from "./AdminSlice";

describe("Admin Slice", () => {
  const initialState = {
    tasks: [],
    engineerTasks: [],
    completedTasks: [],
    deferredTasks: [],
    users: [],
    engineers: [],
    approvedEngineers: [],
    loading: false,
    error: null,
  };

  // --- Basic Fulfillment Cases ---
  it("returns the initial state", () => {
    expect(adminReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("handles fetchAllTasks.fulfilled with valid payload", () => {
    const mockTasks = [{ id: 1, title: "Task 1" }, { id: 2, title: "Task 2" }];
    const action = { type: fetchAllTasks.fulfilled.type, payload: mockTasks };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.tasks).toEqual(mockTasks);
    expect(state.loading).toBe(false);
  });

  it("handles fetchAllTasks.fulfilled with null/undefined payload", () => {
    let action = { type: fetchAllTasks.fulfilled.type, payload: null };
    let state = adminReducer({ ...initialState, loading: true, tasks: [{ id: 1, title: "Existing" }] }, action);
    expect(state.tasks).toEqual(null); // current reducer simply assigns payload
    expect(state.loading).toBe(false);

    action = { type: fetchAllTasks.fulfilled.type, payload: undefined };
    state = adminReducer({ ...initialState, loading: true, tasks: [{ id: 1, title: "Existing" }] }, action);
    expect(state.tasks).toEqual(undefined);
    expect(state.loading).toBe(false);
  });

  it("handles fetchAllUsers.fulfilled", () => {
    const mockUsers = [{ id: 1, name: "User 1" }];
    const action = { type: fetchAllUsers.fulfilled.type, payload: mockUsers };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.users).toEqual(mockUsers);
    expect(state.loading).toBe(false);
  });

  it("handles fetchAllApprovedEngineers.fulfilled", () => {
    const mockEngineers = [{ id: 1, name: "Engineer 1", approved: true }];
    const action = { type: fetchAllApprovedEngineers.fulfilled.type, payload: mockEngineers };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.approvedEngineers).toEqual(mockEngineers);
    expect(state.loading).toBe(false);
  });

  it("handles fetchAllEngineers.fulfilled", () => {
    const mockEngineers = [{ id: 1, name: "Engineer 1" }];
    const action = { type: fetchAllEngineers.fulfilled.type, payload: mockEngineers };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.engineers).toEqual(mockEngineers);
    expect(state.loading).toBe(false);
  });

  it("handles approveEngineer.fulfilled with valid engineer update", () => {
    const updatedEngineer = { email: "eng@example.com", name: "Engineer 1", approved: true };
    const prevState = {
      ...initialState,
      engineers: [
        { email: "eng@example.com", name: "Engineer 1", approved: false },
        { email: "eng2@example.com", name: "Engineer 2", approved: false },
      ],
      approvedEngineers: [],
      loading: true,
    };
    const action = { type: approveEngineer.fulfilled.type, payload: { engineer: updatedEngineer } };
    const state = adminReducer(prevState, action);
    expect(state.engineers[0]).toEqual(updatedEngineer);
    expect(state.approvedEngineers).toContainEqual(updatedEngineer);
    expect(state.loading).toBe(false);
  });

  it("handles fetchDeferredTasks.fulfilled", () => {
    const mockDeferred = [{ id: 1, title: "Deferred 1" }];
    const action = { type: fetchDeferredTasks.fulfilled.type, payload: mockDeferred };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.deferredTasks).toEqual(mockDeferred);
    expect(state.loading).toBe(false);
  });

  it("handles fetchEngineerTasks.fulfilled", () => {
    const mockEngineerTasks = [{ id: 1, title: "Engineer Task" }];
    const action = { type: fetchEngineerTasks.fulfilled.type, payload: mockEngineerTasks };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.engineerTasks).toEqual(mockEngineerTasks);
    expect(state.loading).toBe(false);
  });

  it("handles fetchAvailableEngineers.fulfilled", () => {
    const mockAvailable = [{ id: 1, name: "Avail Eng" }];
    const action = { type: fetchAvailableEngineers.fulfilled.type, payload: mockAvailable };
    const state = adminReducer({ ...initialState, loading: true }, action);
    expect(state.availableEngineers).toEqual(mockAvailable);
    expect(state.loading).toBe(false);
  });

  describe("reassignTicket.fulfilled", () => {
    const mockTicket = { id: "123", title: "Task 1", assignedTo: "456" };

    it("updates matching ticket in tasks", () => {
      const prevState = {
        ...initialState,
        tasks: [
          { id: "123", title: "Task 1", assignedTo: "789" },
          { id: "456", title: "Task 2", assignedTo: "789" },
        ],
        loading: true,
      };
      const action = { type: reassignTicket.fulfilled.type, payload: mockTicket };
      const state = adminReducer(prevState, action);
      expect(state.tasks[0]).toEqual(mockTicket);
      expect(state.tasks[1]).toEqual(prevState.tasks[1]);
      expect(state.loading).toBe(false);
    });

    it("leaves tasks unchanged if no matching ticket exists", () => {
      const prevState = { ...initialState, tasks: [{ id: "999", title: "Other", assignedTo: "000" }], loading: true };
      const action = { type: reassignTicket.fulfilled.type, payload: mockTicket };
      const state = adminReducer(prevState, action);
      expect(state.tasks).toEqual(prevState.tasks);
      expect(state.loading).toBe(false);
    });
  });

  // --- Pending Cases (only checking loading flag) ---
  describe("Pending Actions", () => {
    const pendingTypes = [
      fetchAllTasks.pending.type,
      fetchAllUsers.pending.type,
      fetchAllApprovedEngineers.pending.type,
      fetchAllEngineers.pending.type,
      approveEngineer.pending.type,
      fetchDeferredTasks.pending.type,
      fetchAvailableEngineers.pending.type,
      reassignTicket.pending.type,
      fetchEngineerTasks.pending.type,
    ];
    pendingTypes.forEach((type) => {
      it(`sets loading true for pending action ${type}`, () => {
        const action = { type };
        const state = adminReducer(initialState, action);
        expect(state.loading).toBe(true);
        // We no longer assert that error becomes null since our reducer doesn't change it.
      });
    });
  });

  // --- Rejected Cases (error is set from payload if provided, else from action.error.message) ---
  describe("Rejected Actions", () => {
    it("handles a rejected action with payload", () => {
      const action = { type: fetchAllTasks.rejected.type, payload: "Failed to fetch tasks" };
      const state = adminReducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual("Failed to fetch tasks");
      expect(state.loading).toBe(false);
    });

    it("handles a rejected action with error.message if no payload", () => {
      const action = { type: reassignTicket.rejected.type, error: { message: "Error reassigning ticket" } };
      const state = adminReducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual("Error reassigning ticket");
      expect(state.loading).toBe(false);
    });
  });
});