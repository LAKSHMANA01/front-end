import reducer, {
  fetchAllTasks,
  fetchAllUsers,
  fetchAllApprovedEngineers,
  fetchAllEngineers,
  approveEngineer,
  fetchDeferredTasks,
  fetchAvailableEngineers,
  reassignTicket,
  fetchEngineerTasks,
} from "./AdminSlice";

import apiClientAdmin from "../../utils/apiClientAdmin";

jest.mock("../../utils/apiClientAdmin", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

// ---------------------------------------------------------------------
// Reducer tests for extraReducers
// ---------------------------------------------------------------------
describe("adminSlice reducer", () => {
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
    // availableEngineers is added dynamically via fulfilled branch
  };

  // --- fetchAllTasks ---
  describe("fetchAllTasks", () => {
    it("sets loading true on pending", () => {
      const action = { type: fetchAllTasks.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    it("sets tasks and loading false on fulfilled", () => {
      const tasksPayload = [{ id: 1, name: "Task 1" }];
      const action = { type: fetchAllTasks.fulfilled.type, payload: tasksPayload };
      const state = reducer(initialState, action);
      expect(state.tasks).toEqual(tasksPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch tasks";
      const action = { type: fetchAllTasks.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchAllUsers ---
  describe("fetchAllUsers", () => {
    it("sets loading true on pending", () => {
      const action = { type: fetchAllUsers.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    it("sets users and loading false on fulfilled", () => {
      const usersPayload = [{ id: 1, name: "User 1" }];
      const action = { type: fetchAllUsers.fulfilled.type, payload: usersPayload };
      const state = reducer(initialState, action);
      expect(state.users).toEqual(usersPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch users";
      const action = { type: fetchAllUsers.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchAllApprovedEngineers ---
  describe("fetchAllApprovedEngineers", () => {
    it("sets loading true on pending", () => {
      const action = { type: fetchAllApprovedEngineers.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    it("sets approvedEngineers and loading false on fulfilled", () => {
      const engineersPayload = [{ email: "eng1@test.com" }];
      const action = { type: fetchAllApprovedEngineers.fulfilled.type, payload: engineersPayload };
      const state = reducer(initialState, action);
      expect(state.approvedEngineers).toEqual(engineersPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch engineers";
      const action = { type: fetchAllApprovedEngineers.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchDeferredTasks ---
  describe("fetchDeferredTasks", () => {
    it("sets loading true on pending", () => {
      const action = { type: fetchDeferredTasks.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    it("sets deferredTasks and loading false on fulfilled", () => {
      const ticketsPayload = [{ id: 101, task: "Deferred Task" }];
      const action = { type: fetchDeferredTasks.fulfilled.type, payload: ticketsPayload };
      const state = reducer(initialState, action);
      expect(state.deferredTasks).toEqual(ticketsPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch deferred tasks";
      const action = { type: fetchDeferredTasks.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchEngineerTasks ---
  describe("fetchEngineerTasks", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchEngineerTasks.pending.type };
      const state = reducer({ ...initialState, error: "prev error" }, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
    it("sets engineerTasks and loading false on fulfilled", () => {
      const tasksPayload = [{ id: 201, task: "Engineer Task" }];
      const action = { type: fetchEngineerTasks.fulfilled.type, payload: tasksPayload };
      const state = reducer(initialState, action);
      expect(state.engineerTasks).toEqual(tasksPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error (using payload.message) and loading false on rejected", () => {
      const errorObj = { message: "Error fetching tasks" };
      const action = { type: fetchEngineerTasks.rejected.type, payload: errorObj, error: {} };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Error fetching tasks");
      expect(state.loading).toBe(false);
    });
    it("sets default error and loading false on rejected when payload has no message", () => {
      const action = { type: fetchEngineerTasks.rejected.type, payload: undefined, error: {} };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Error fetching tasks.");
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchAvailableEngineers ---
  describe("fetchAvailableEngineers", () => {
    it("sets loading true on pending", () => {
      const action = { type: fetchAvailableEngineers.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    it("sets availableEngineers and loading false on fulfilled", () => {
      const engineersPayload = [{ id: 301, name: "Engineer 1" }];
      const action = { type: fetchAvailableEngineers.fulfilled.type, payload: engineersPayload };
      const state = reducer(initialState, action);
      expect(state.availableEngineers).toEqual(engineersPayload);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorMessage = "Available engineers error";
      const action = { type: fetchAvailableEngineers.rejected.type, error: { message: errorMessage } };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorMessage);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchAllEngineers ---
  describe("fetchAllEngineers", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchAllEngineers.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
    it("sets engineers (if payload is an array) and loading false on fulfilled", () => {
      const engineersPayload = [{ email: "eng1@test.com" }];
      const action = { type: fetchAllEngineers.fulfilled.type, payload: engineersPayload };
      const state = reducer(initialState, action);
      expect(state.engineers).toEqual(engineersPayload);
      expect(state.loading).toBe(false);
    });
    it("sets engineers to empty array if payload is not an array on fulfilled", () => {
      const action = { type: fetchAllEngineers.fulfilled.type, payload: "not an array" };
      const state = reducer(initialState, action);
      expect(state.engineers).toEqual([]);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch engineers";
      const action = { type: fetchAllEngineers.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- approveEngineer ---
  describe("approveEngineer", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: approveEngineer.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
    it("updates engineers list and approvedEngineers on fulfilled", () => {
      const initial = {
        ...initialState,
        engineers: [{ email: "eng1@test.com", approved: false }],
        approvedEngineers: [],
      };
      const updatedEngineer = { email: "eng1@test.com", approved: true };
      const action = { type: approveEngineer.fulfilled.type, payload: { engineer: updatedEngineer } };
      const state = reducer(initial, action);
      expect(state.engineers).toEqual([updatedEngineer]);
      expect(state.approvedEngineers).toContainEqual(updatedEngineer);
      expect(state.loading).toBe(false);
    });
    it("does nothing if fulfilled payload has no engineer", () => {
      const initial = {
        ...initialState,
        engineers: [{ email: "eng1@test.com", approved: false }],
        approvedEngineers: [],
      };
      const action = { type: approveEngineer.fulfilled.type, payload: {} };
      const state = reducer(initial, action);
      expect(state.engineers).toEqual(initial.engineers);
      expect(state.approvedEngineers).toEqual(initial.approvedEngineers);
      expect(state.loading).toBe(false);
    });
    it("sets error and loading false on rejected", () => {
      const errorPayload = "Failed to update engineer approval";
      const action = { type: approveEngineer.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------
// Async thunk tests (payload creators)
// ---------------------------------------------------------------------
describe("adminSlice async thunks", () => {
  const dummyDispatch = jest.fn();
  const dummyGetState = jest.fn();
  const dummyExtra = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- fetchAllTasks ---
  describe("fetchAllTasks", () => {
    it("fetches tasks successfully", async () => {
      const tasks = [{ id: 1, name: "Task 1" }];
      apiClientAdmin.get.mockResolvedValue({ data: { tasks } });
      const action = fetchAllTasks();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(tasks);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/admin/tasks");
    });
    it("handles error in fetchAllTasks", async () => {
      const errorResponse = { response: { data: "Failed to fetch tasks" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchAllTasks();
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap()).rejects.toEqual("Failed to fetch tasks");
    });
  });

  // --- fetchAllUsers ---
  describe("fetchAllUsers", () => {
    it("fetches users successfully", async () => {
      const users = [{ id: 1, name: "User 1" }];
      apiClientAdmin.get.mockResolvedValue({ data: { users } });
      const action = fetchAllUsers();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(users);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/admin/users");
    });
    it("handles error in fetchAllUsers", async () => {
      const errorResponse = { response: { data: "Failed to fetch users" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchAllUsers();
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap()).rejects.toEqual("Failed to fetch users");
    });
  });

  // --- fetchAllApprovedEngineers ---
  describe("fetchAllApprovedEngineers", () => {
    it("fetches approved engineers successfully", async () => {
      const engineers = [{ email: "eng1@test.com" }];
      apiClientAdmin.get.mockResolvedValue({ data: { users: engineers } });
      const action = fetchAllApprovedEngineers();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(engineers);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/admin/engineers");
    });
    it("handles error in fetchAllApprovedEngineers", async () => {
      const errorResponse = { response: { data: "Failed to fetch engineers" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchAllApprovedEngineers();
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap()).rejects.toEqual("Failed to fetch engineers");
    });
  });

  // --- fetchAllEngineers ---
  describe("fetchAllEngineers", () => {
    it("fetches engineers successfully when payload is an array", async () => {
      const engineers = [{ email: "eng1@test.com" }];
      apiClientAdmin.get.mockResolvedValue({ data: { engineers } });
      const action = fetchAllEngineers();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(engineers);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/admin/approval/engineers");
    });
    it("fetches engineers successfully when payload is not an array", async () => {
      apiClientAdmin.get.mockResolvedValue({ data: { engineers: "not an array" } });
      const action = fetchAllEngineers();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      // In the reducer, non-array payload becomes []
      expect(result).toEqual("not an array"); // The thunk returns the raw payload.
    });
    it("handles error in fetchAllEngineers", async () => {
      const errorResponse = { response: { data: "Failed to fetch engineers" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchAllEngineers();
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap()).rejects.toEqual("Failed to fetch engineers");
    });
  });

  // --- approveEngineer ---
  describe("approveEngineer", () => {
    it("approves engineer successfully", async () => {
      const updatedEngineer = { email: "eng1@test.com", approved: true };
      apiClientAdmin.patch.mockResolvedValue({ data: { engineer: updatedEngineer } });
      const params = { engineerEmail: "eng1@test.com", approve: true };
      const action = approveEngineer(params);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual({ engineer: updatedEngineer });
      expect(apiClientAdmin.patch).toHaveBeenCalledWith(
        `/admin/approve-engineer/eng1@test.com`,
        { email: "eng1@test.com", approve: true }
      );
    });
    it("handles error in approveEngineer", async () => {
      const errorResponse = { response: { data: "Failed to update engineer approval" } };
      apiClientAdmin.patch.mockRejectedValue(errorResponse);
      const params = { engineerEmail: "eng1@test.com", approve: false };
      const action = approveEngineer(params);
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to update engineer approval");
    });
  });

  // --- fetchDeferredTasks ---
  describe("fetchDeferredTasks", () => {
    it("fetches deferred tasks successfully", async () => {
      const tickets = [{ id: 101, task: "Deferred Task" }];
      apiClientAdmin.get.mockResolvedValue({ data: { tickets } });
      const action = fetchDeferredTasks();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(tickets);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/admin/status/deferred");
    });
    it("handles error in fetchDeferredTasks", async () => {
      const errorResponse = { response: { data: "Failed to fetch deferred tasks" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchDeferredTasks();
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to fetch deferred tasks");
    });
  });

  // --- fetchAvailableEngineers ---
  describe("fetchAvailableEngineers", () => {
    it("fetches available engineers successfully", async () => {
      const engineers = [{ id: 301, name: "Engineer 1" }];
      apiClientAdmin.get.mockResolvedValue({ data: { engineers } });
      const action = fetchAvailableEngineers();
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(engineers);
      expect(apiClientAdmin.get).toHaveBeenCalledWith("/api/engineers/available");
    });
  });

  // --- reassignTicket ---
  describe("reassignTicket", () => {
    it("reassigns ticket successfully", async () => {
      const reassignedTicket = { id: "t1", status: "reassigned" };
      apiClientAdmin.patch.mockResolvedValue({ data: reassignedTicket });
      const params = { ticketId: "t1", engineerId: "e1" };
      const action = reassignTicket(params);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(reassignedTicket);
      expect(apiClientAdmin.patch).toHaveBeenCalledWith(
        `/api/reassign/t1/e1`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  // --- fetchEngineerTasks ---
  describe("fetchEngineerTasks", () => {
    it("fetches engineer tasks successfully", async () => {
      const data = { tasks: [{ id: "et1", task: "Engineer Task" }] };
      apiClientAdmin.get.mockResolvedValue({ data });
      const action = fetchEngineerTasks("engineer@example.com");
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(data);
      expect(apiClientAdmin.get).toHaveBeenCalledWith(`/tasks/engineer/engineer@example.com`);
    });
    it("handles error in fetchEngineerTasks", async () => {
      const errorResponse = { response: { data: "Error fetching tasks" } };
      apiClientAdmin.get.mockRejectedValue(errorResponse);
      const action = fetchEngineerTasks("engineer@example.com");
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Error fetching tasks");
    });
  });
});