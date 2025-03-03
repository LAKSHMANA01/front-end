// engineerSlice.test.js
import reducer, {
  fetchProfile,
  fetchEngineerTasks,
  fetchAcceptTask,
  fetchRejectTask,
  fetchUpdateEngineerProfile,
  fetchEngineerProfiledata,
  updateTaskStatus,
  HazardsTickets,
  HazardsUpdateTickets,
  HazardsDeleteTickets,
} from "./EngineerSlice";

import apiClientUser from "../../utils/apiClientUser";
import apiClientEngineer from "../../utils/apiClientEngineer";
import apiClientNH from "../../utils/apiClientNH";
import axios from "axios";

jest.mock("../../utils/apiClientUser", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("../../utils/apiClientEngineer", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("../../utils/apiClientNH", () => ({
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("axios", () => ({
  patch: jest.fn(),
}));

// ---------------------------------------------------------------------
// Reducer tests for extraReducers
// ---------------------------------------------------------------------
describe("engineerSlice reducer", () => {
  const initialState = {
    tasks: [],
    updateProfile: [],
    profiledata: {},
    Hazards: [],
    loading: false,
    error: null,
  };

  // --- fetchEngineerTasks ---
  describe("fetchEngineerTasks reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchEngineerTasks.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates tasks when fulfilled with an array payload", () => {
      const tasksPayload = [{ _id: "1", name: "Task 1" }];
      const action = {
        type: fetchEngineerTasks.fulfilled.type,
        payload: tasksPayload,
      };
      const state = reducer(initialState, action);
      expect(state.tasks).toEqual(tasksPayload);
      expect(state.loading).toBe(false);
    });

    it("sets tasks empty and error when fulfilled payload has a message", () => {
      const payload = { message: "No tasks available you." };
      const action = { type: fetchEngineerTasks.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.tasks).toEqual([]);
      expect(state.error).toEqual("No tasks available you.");
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected with payload", () => {
      const action = { type: fetchEngineerTasks.rejected.type, payload: "Fetch error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Fetch error");
      expect(state.loading).toBe(false);
    });

    it("updates error with default message when payload is undefined on rejected", () => {
      const action = { type: fetchEngineerTasks.rejected.type, payload: undefined };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Error fetching tasks");
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchAcceptTask ---
  describe("fetchAcceptTask reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchAcceptTask.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates the task in tasks array on fulfilled", () => {
      const initial = {
        ...initialState,
        tasks: [
          { _id: "1", status: "pending" },
          { _id: "2", status: "pending" },
        ],
      };
      const updatedTask = { _id: "1", status: "accepted" };
      const action = {
        type: fetchAcceptTask.fulfilled.type,
        payload: { taskId: "1", updatedTask },
      };
      const state = reducer(initial, action);
      expect(state.tasks).toEqual([updatedTask, { _id: "2", status: "pending" }]);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: fetchAcceptTask.rejected.type, payload: "Accept task error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Accept task error");
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchRejectTask ---
  describe("fetchRejectTask reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchRejectTask.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("removes the task from tasks array on fulfilled", () => {
      const initial = {
        ...initialState,
        tasks: [
          { _id: "1", name: "Task 1" },
          { _id: "2", name: "Task 2" },
        ],
      };
      const action = {
        type: fetchRejectTask.fulfilled.type,
        payload: { taskId: "1" },
      };
      const state = reducer(initial, action);
      expect(state.tasks).toEqual([{ _id: "2", name: "Task 2" }]);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: fetchRejectTask.rejected.type, payload: "Reject task error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Reject task error");
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchUpdateEngineerProfile ---
  describe("fetchUpdateEngineerProfile reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchUpdateEngineerProfile.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates updateProfile on fulfilled", () => {
      const profilePayload = { name: "Engineer Updated" };
      const action = { type: fetchUpdateEngineerProfile.fulfilled.type, payload: profilePayload };
      const state = reducer(initialState, action);
      expect(state.updateProfile).toEqual(profilePayload);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: fetchUpdateEngineerProfile.rejected.type, payload: "Update profile error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Update profile error");
      expect(state.loading).toBe(false);
    });
  });

  // --- fetchEngineerProfiledata ---
  describe("fetchEngineerProfiledata reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: fetchEngineerProfiledata.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates updateProfile on fulfilled", () => {
      const profileData = { name: "Profile Data" };
      const action = { type: fetchEngineerProfiledata.fulfilled.type, payload: profileData };
      const state = reducer(initialState, action);
      expect(state.updateProfile).toEqual(profileData);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: fetchEngineerProfiledata.rejected.type, payload: "Profile data error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Profile data error");
      expect(state.loading).toBe(false);
    });
  });

  // --- updateTaskStatus ---
  describe("updateTaskStatus reducer cases", () => {
    it("updates task status if task exists on fulfilled", () => {
      const initial = {
        ...initialState,
        tasks: [{ _id: "1", status: "pending" }],
      };
      const action = { type: updateTaskStatus.fulfilled.type, payload: { taskId: "1", status: "deferred" } };
      const state = reducer(initial, action);
      expect(state.tasks).toEqual([{ _id: "1", status: "deferred" }]);
    });

    it("does not update tasks if task does not exist on fulfilled", () => {
      const initial = {
        ...initialState,
        tasks: [{ _id: "1", status: "pending" }],
      };
      const action = { type: updateTaskStatus.fulfilled.type, payload: { taskId: "2", status: "deferred" } };
      const state = reducer(initial, action);
      expect(state.tasks).toEqual([{ _id: "1", status: "pending" }]);
    });

    it("updates error on rejected", () => {
      const action = { type: updateTaskStatus.rejected.type, payload: "Update status error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Update status error");
    });
  });

  // --- HazardsTickets ---
  describe("HazardsTickets reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: HazardsTickets.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates Hazards on fulfilled", () => {
      const hazardsPayload = [{ _id: "h1", name: "Hazard 1" }];
      const action = { type: HazardsTickets.fulfilled.type, payload: hazardsPayload };
      const state = reducer(initialState, action);
      expect(state.Hazards).toEqual(hazardsPayload);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: HazardsTickets.rejected.type, payload: "Hazards error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Hazards error");
      expect(state.loading).toBe(false);
    });
  });

  // --- HazardsUpdateTickets ---
  describe("HazardsUpdateTickets reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: HazardsUpdateTickets.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates Hazards on fulfilled", () => {
      const hazardsPayload = [{ _id: "h1", name: "Updated Hazard" }];
      const action = { type: HazardsUpdateTickets.fulfilled.type, payload: hazardsPayload };
      const state = reducer(initialState, action);
      expect(state.Hazards).toEqual(hazardsPayload);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: HazardsUpdateTickets.rejected.type, payload: "Hazards update error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Hazards update error");
      expect(state.loading).toBe(false);
    });
  });

  // --- HazardsDeleteTickets ---
  describe("HazardsDeleteTickets reducer cases", () => {
    it("sets loading true and resets error on pending", () => {
      const action = { type: HazardsDeleteTickets.pending.type };
      const state = reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("updates Hazards on fulfilled", () => {
      const hazardsPayload = [{ _id: "h2", name: "Remaining Hazard" }];
      const action = { type: HazardsDeleteTickets.fulfilled.type, payload: hazardsPayload };
      const state = reducer(initialState, action);
      expect(state.Hazards).toEqual(hazardsPayload);
      expect(state.loading).toBe(false);
    });

    it("updates error and sets loading false on rejected", () => {
      const action = { type: HazardsDeleteTickets.rejected.type, payload: "Hazards delete error" };
      const state = reducer(initialState, action);
      expect(state.error).toEqual("Hazards delete error");
      expect(state.loading).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------
// Async Thunk tests (covering payload creators)
// ---------------------------------------------------------------------
describe("engineer async thunks", () => {
  const dummyDispatch = jest.fn();
  const dummyGetState = jest.fn();
  const dummyExtra = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- fetchProfile ---
  describe("fetchProfile", () => {
    it("fetches profile successfully", async () => {
      const userData = { email: "test@example.com", name: "Test User" };
      apiClientUser.get.mockResolvedValue({ data: { profile: { user: userData } } });
      const action = fetchProfile({ userEmail: "test@example.com", role: "engineer" });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(userData);
      expect(apiClientUser.get).toHaveBeenCalledWith(`/users/profile/engineer/test@example.com`);
    });
  });

  // --- fetchEngineerTasks ---
  describe("fetchEngineerTasks", () => {
    it("fetches engineer tasks successfully", async () => {
      const tasks = [{ _id: "1", name: "Task 1" }];
      apiClientEngineer.get.mockResolvedValue({ data: { tasks } });
      const action = fetchEngineerTasks("engineer@example.com");
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(tasks);
      expect(apiClientEngineer.get).toHaveBeenCalledWith(`/tasks/engineer/engineer@example.com`);
    });

    it("returns message if no data in fetchEngineerTasks", async () => {
      apiClientEngineer.get.mockResolvedValue({ data: null });
      const action = fetchEngineerTasks("engineer@example.com");
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual({ message: "No tasks available you." });
    });

    it("handles error in fetchEngineerTasks", async () => {
      const errorResponse = { response: { data: "Failed to fetch engineer tasks" } };
      apiClientEngineer.get.mockRejectedValue(errorResponse);
      const action = fetchEngineerTasks("engineer@example.com");
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to fetch engineer tasks");
    });
  });

  // --- fetchAcceptTask ---
  describe("fetchAcceptTask", () => {
    it("accepts task successfully", async () => {
      const updatedTask = { _id: "1", status: "accepted" };
      apiClientEngineer.patch.mockResolvedValue({ data: { result: { ticket: updatedTask } } });
      const action = fetchAcceptTask({ taskId: "1", email: "engineer@example.com" });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual({ taskId: "1", updatedTask });
      expect(apiClientEngineer.patch).toHaveBeenCalledWith(`/tasks/1/accept/engineer@example.com`);
    });

    it("handles error in fetchAcceptTask", async () => {
      const errorResponse = { response: { data: "Failed to accept task" } };
      apiClientEngineer.patch.mockRejectedValue(errorResponse);
      const action = fetchAcceptTask({ taskId: "1", email: "engineer@example.com" });
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to accept task");
    });
  });

  // --- fetchRejectTask ---
  describe("fetchRejectTask", () => {
    it("rejects task successfully", async () => {
      apiClientEngineer.patch.mockResolvedValue({});
      const action = fetchRejectTask({ taskId: "1", email: "engineer@example.com" });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual({ taskId: "1" });
      expect(apiClientEngineer.patch).toHaveBeenCalledWith(`/tasks/1/reject/engineer@example.com`);
    });

    it("handles error in fetchRejectTask", async () => {
      const errorResponse = { response: { data: "Failed to reject task" } };
      apiClientEngineer.patch.mockRejectedValue(errorResponse);
      const action = fetchRejectTask({ taskId: "1", email: "engineer@example.com" });
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to reject task");
    });
  });


  // --- fetchEngineerProfiledata ---
  describe("fetchEngineerProfiledata", () => {
    it("updates engineer profile data successfully", async () => {
      const profileData = { name: "Profile Data" };
      axios.patch.mockResolvedValue({ data: profileData });
      const action = fetchEngineerProfiledata({ name: "Profile Data" });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(profileData);
      expect(axios.patch).toHaveBeenCalledWith(
        `https://localhost:8000/api/updateProfile/engineer/3`,
        { name: "Profile Data" },
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("handles error in fetchEngineerProfiledata", async () => {
      const errorResponse = { response: { data: "Failed to update engineer profile" } };
      axios.patch.mockRejectedValue(errorResponse);
      const action = fetchEngineerProfiledata({});
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to update engineer profile");
    });
  });

  // --- updateTaskStatus ---
  describe("updateTaskStatus", () => {

    it("updates task status and dispatches fetchEngineerTasks when status is 'deferred'", async () => {
      const responseData = { task: { _id: "1", status: "deferred", engineerEmail: "engineer@example.com" } };
      apiClientEngineer.patch.mockResolvedValue({ data: responseData });
      const action = updateTaskStatus({ taskId: "1", status: "deferred" });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(responseData);
      expect(apiClientEngineer.patch).toHaveBeenCalledWith(`/tasks/updateTicketStatus/1`, { status: "deferred" });
      // When deferred, the thunk dispatches fetchEngineerTasks. We verify dispatch was called.
      expect(dummyDispatch).toHaveBeenCalled();
    });

    it("handles error in updateTaskStatus", async () => {
      const errorResponse = { response: { data: "Update status error" } };
      apiClientEngineer.patch.mockRejectedValue(errorResponse);
      const action = updateTaskStatus({ taskId: "1", status: "completed" });
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Update status error");
    });
  });

  // --- HazardsTickets ---
  describe("HazardsTickets", () => {
    it("fetches hazards tickets successfully", async () => {
      const hazards = [{ _id: "h1", name: "Hazard 1" }];
      apiClientNH.get.mockResolvedValue({ data: { hazards } });
      // For this thunk, pass a dummy object with rejectWithValue
      const action = HazardsTickets({ rejectWithValue: (val) => val });
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(hazards);
      expect(apiClientNH.get).toHaveBeenCalledWith(`/hazards/getAllHazards`);
    });

  });

  // --- HazardsUpdateTickets ---
  describe("HazardsUpdateTickets", () => {
    it("updates hazards tickets successfully", async () => {
      const updatedData = { _id: "h1", name: "Updated Hazard" };
      const hazards = [{ _id: "h1", name: "Updated Hazard" }];
      apiClientNH.patch.mockResolvedValue({ data: {} });
      apiClientNH.get.mockResolvedValue({ data: { hazards } });
      const action = HazardsUpdateTickets(updatedData);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(hazards);
      expect(apiClientNH.patch).toHaveBeenCalledWith(`/hazards/updateHazard/${updatedData._id}`, updatedData, { headers: { "Content-Type": "application/json" } });
      expect(apiClientNH.get).toHaveBeenCalledWith(`/hazards/getAllHazards`);
    });

    it("handles error in HazardsUpdateTickets", async () => {
      const updatedData = { _id: "h1", name: "Updated Hazard" };
      const errorResponse = { response: { data: "Failed to HazardsUpdateTickets" } };
      apiClientNH.patch.mockRejectedValue(errorResponse);
      const action = HazardsUpdateTickets(updatedData);
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to HazardsUpdateTickets");
    });
  });

  // --- HazardsDeleteTickets ---
  describe("HazardsDeleteTickets", () => {
    it("deletes hazards tickets successfully", async () => {
      const hazards = [{ _id: "h2", name: "Remaining Hazard" }];
      apiClientNH.delete.mockResolvedValue({ data: {} });
      apiClientNH.get.mockResolvedValue({ data: { hazards } });
      const action = HazardsDeleteTickets("h1");
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(hazards);
      expect(apiClientNH.delete).toHaveBeenCalledWith(`/hazards/deleteHazard/h1`);
      expect(apiClientNH.get).toHaveBeenCalledWith(`/hazards/getAllHazards`);
    });

    it("handles error in HazardsDeleteTickets", async () => {
      const errorResponse = { response: { data: "Failed to HazardsUpdateTickets" } };
      apiClientNH.delete.mockRejectedValue(errorResponse);
      const action = HazardsDeleteTickets("h1");
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to HazardsUpdateTickets");
    });
  });
});