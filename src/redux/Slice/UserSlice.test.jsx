import reducer, { fetchTickets, fetchProfile, fetchUpdateProfile } from "./UserSlice";
import apiClientUser from "../../utils/apiClientUser";
import apiClientEngineer from "../../utils/apiClientEngineer";

jest.mock("../../utils/apiClientUser", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("../../utils/apiClientEngineer", () => ({
  get: jest.fn(),
}));

// ---------------------------------------------------------------------
// Reducer tests for extraReducers
// ---------------------------------------------------------------------
describe("ticketSlice reducer", () => {
  const initialState = {
    tasks: [],
    profile: {},
    updateProfile: {},
    loading: false,
    error: null,
  };

  // --- fetchTickets reducer cases ---
  describe("fetchTickets", () => {
    it("should set loading true and clear error on pending", () => {
      const action = { type: fetchTickets.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should set tasks and loading false on fulfilled", () => {
      const tasksPayload = [{ id: 1, task: "Task 1" }];
      const action = { type: fetchTickets.fulfilled.type, payload: tasksPayload };
      const state = reducer(initialState, action);
      expect(state.tasks).toEqual(tasksPayload);
      expect(state.loading).toBe(false);
    });

    it("should set error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch tickets";
      const action = { type: fetchTickets.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchProfile reducer cases ---
  describe("fetchProfile", () => {
    it("should set loading true and clear error on pending", () => {
      const action = { type: fetchProfile.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should set profile and loading false on fulfilled", () => {
      const profilePayload = { email: "user@example.com", name: "User" };
      const action = { type: fetchProfile.fulfilled.type, payload: profilePayload };
      const state = reducer(initialState, action);
      expect(state.profile).toEqual(profilePayload);
      expect(state.loading).toBe(false);
    });

    it("should set error and loading false on rejected", () => {
      const errorPayload = "Failed to fetch profile";
      const action = { type: fetchProfile.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchUpdateProfile reducer cases ---
  describe("fetchUpdateProfile", () => {
    it("should set loading true and clear error on pending", () => {
      const action = { type: fetchUpdateProfile.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should set updateProfile and loading false on fulfilled", () => {
      const updatePayload = { name: "Updated Name" };
      const action = { type: fetchUpdateProfile.fulfilled.type, payload: updatePayload };
      const state = reducer(initialState, action);
      expect(state.updateProfile).toEqual(updatePayload);
      expect(state.loading).toBe(false);
    });

    it("should set error and loading false on rejected", () => {
      const errorPayload = "Failed to update profile";
      const action = { type: fetchUpdateProfile.rejected.type, payload: errorPayload };
      const state = reducer(initialState, action);
      expect(state.error).toEqual(errorPayload);
      expect(state.loading).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------
// Async thunk tests (covering payload creators)
// ---------------------------------------------------------------------
describe("ticketSlice async thunks", () => {
  const dummyDispatch = jest.fn();
  const dummyGetState = jest.fn();
  const dummyExtra = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- fetchTickets async thunk ---
  describe("fetchTickets", () => {
    it("should fetch tickets successfully", async () => {
      const tasks = [{ id: 1, task: "Task 1" }];
      apiClientEngineer.get.mockResolvedValue({ data: { tasks } });
      const params = { userEmail: "test@example.com", role: "engineer" };
      const action = fetchTickets(params);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(tasks);
      expect(apiClientEngineer.get).toHaveBeenCalledWith(`/tasks/engineer/test@example.com`);
    });

  });

  // --- fetchProfile async thunk ---
  describe("fetchProfile", () => {
    it("should fetch profile successfully", async () => {
      const profile = { email: "user@example.com", name: "User" };
      apiClientUser.get.mockResolvedValue({ data: { profile: { user: profile } } });
      const params = { userEmail: "user@example.com", role: "customer" };
      const action = fetchProfile(params);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(profile);
      expect(apiClientUser.get).toHaveBeenCalledWith(`/users/profile/customer/user@example.com`);
    });
  });

  // --- fetchUpdateProfile async thunk ---
  describe("fetchUpdateProfile", () => {
    it("should update profile successfully", async () => {
      const updatedata = { name: "New Name" };
      const responseData = { name: "New Name", updated: true };
      apiClientUser.patch.mockResolvedValue({ data: responseData });
      const params = { userEmail: "user@example.com", role: "customer", updatedata };
      const action = fetchUpdateProfile(params);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(responseData);
      expect(apiClientUser.patch).toHaveBeenCalledWith(
        `/users/updateProfile/customer/user@example.com`,
        updatedata
      );
    });

    it("should handle error in fetchUpdateProfile with error.response.data", async () => {
      const updatedata = { name: "New Name" };
      const errorResponse = { response: { data: "Update failed" } };
      apiClientUser.patch.mockRejectedValue(errorResponse);
      const params = { userEmail: "user@example.com", role: "customer", updatedata };
      const action = fetchUpdateProfile(params);
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Update failed");
    });

    it("should handle error in fetchUpdateProfile with default error message", async () => {
      const updatedata = { name: "New Name" };
      const errorResponse = { response: {} };
      apiClientUser.patch.mockRejectedValue(errorResponse);
      const params = { userEmail: "user@example.com", role: "customer", updatedata };
      const action = fetchUpdateProfile(params);
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to update profile");
    });
  });
});