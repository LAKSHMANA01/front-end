import { configureStore } from "@reduxjs/toolkit";
import engineerReducer, {
  fetchProfile,
  fetchEngineerTasks,
  fetchAcceptTask,
  fetchRejectTask,
  fetchUpdateEngineerProfile,
  updateTaskStatus,
  HazardsTickets,
  HazardsUpdateTickets,
  HazardsDeleteTickets,
} from "./EngineerSlice";
import apiClient from "../../utils/apiClient";

jest.mock("../../utils/apiClient");

describe("Engineer Slice Async Thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { engineer: engineerReducer },
    });
  });

  test("fetchProfile should fetch profile data and update state", async () => {
    const mockProfile = { email: "engineer@test.com", role: "engineer" };
    apiClient.get.mockResolvedValueOnce({ data: mockProfile });

    await store.dispatch(fetchProfile({ userEmail: "engineer@test.com", role: "engineer" }));
    expect(store.getState().engineer.profiledata).toEqual(mockProfile);
  });

  test("fetchEngineerTasks should fetch tasks and update state", async () => {
    const mockTasks = [{ id: 1, title: "Task 1" }];
    apiClient.get.mockResolvedValueOnce({ data: mockTasks });

    await store.dispatch(fetchEngineerTasks("engineer@test.com"));
    expect(store.getState().engineer.tasks).toEqual(mockTasks);
  });

  test("fetchEngineerTasks should handle empty tasks", async () => {
    apiClient.get.mockResolvedValueOnce({ data: null });

    await store.dispatch(fetchEngineerTasks("engineer@test.com"));
    expect(store.getState().engineer.tasks).toEqual([]);
    expect(store.getState().engineer.error).toBe("No tasks available you.");
  });

  test("fetchAcceptTask should update task status to accepted", async () => {
    const mockTask = { _id: 1, status: "accepted" };
    apiClient.patch.mockResolvedValueOnce({ data: { ticket: mockTask } });

    // Initialize state with some tasks
    store.dispatch({
      type: "engineer/fetchEngineerTasks/fulfilled",
      payload: [{ _id: 1, status: "pending" }],
    });

    await store.dispatch(fetchAcceptTask({ taskId: 1, email: "engineer@test.com" }));
    expect(store.getState().engineer.tasks[0]).toEqual(mockTask);
  });

  test("fetchRejectTask should remove task from state", async () => {
    const taskId = 1;
    apiClient.patch.mockResolvedValueOnce({});

    // Initialize state with a task
    store.dispatch({
      type: "engineer/fetchEngineerTasks/fulfilled",
      payload: [{ _id: taskId, status: "pending" }],
    });

    await store.dispatch(fetchRejectTask({ taskId, email: "engineer@test.com" }));
    expect(store.getState().engineer.tasks).toHaveLength(0);
  });

  test("fetchUpdateEngineerProfile should update engineer profile", async () => {
    const mockProfile = { email: "engineer@test.com", name: "Engineer Name" };
    apiClient.patch.mockResolvedValueOnce({ data: mockProfile });

    await store.dispatch(
      fetchUpdateEngineerProfile({
        email: "engineer@test.com",
        updatedData: mockProfile,
      })
    );
    expect(store.getState().engineer.updateProfile).toEqual(mockProfile);
  });

  test("updateTaskStatus should update task status", async () => {
    const mockTask = { _id: 1, status: "deferred", engineerEmail: "engineer@test.com" };
    apiClient.patch.mockResolvedValueOnce({ data: mockTask });

    // Initialize state with a task
    store.dispatch({
      type: "engineer/fetchEngineerTasks/fulfilled",
      payload: [{ _id: 1, status: "pending" }],
    });

    await store.dispatch(updateTaskStatus({ taskId: 1, status: "deferred" }));
    expect(store.getState().engineer.tasks[0].status).toBe("deferred");
  });

  test("HazardsTickets should fetch hazards and update state", async () => {
    const mockHazards = [{ id: 1, title: "Hazard 1" }];
    apiClient.get.mockResolvedValueOnce({ data: mockHazards });

    await store.dispatch(HazardsTickets({}));
    expect(store.getState().engineer.Hazards).toEqual(mockHazards);
  });

  test("HazardsUpdateTickets should update hazard and refresh list", async () => {
    const mockHazard = { _id: 1, title: "Updated Hazard" };
    const updatedHazards = [mockHazard];

    apiClient.patch.mockResolvedValueOnce({ data: mockHazard });
    apiClient.get.mockResolvedValueOnce({ data: updatedHazards });

    await store.dispatch(HazardsUpdateTickets(mockHazard));
    expect(store.getState().engineer.Hazards).toEqual(updatedHazards);
  });

  test("HazardsDeleteTickets should delete hazard and refresh list", async () => {
    const updatedHazards = [];

    apiClient.delete.mockResolvedValueOnce({});
    apiClient.get.mockResolvedValueOnce({ data: updatedHazards });

    await store.dispatch(HazardsDeleteTickets(1));
    expect(store.getState().engineer.Hazards).toEqual(updatedHazards);
  });

  // Error handling tests
  test("fetchEngineerTasks should handle error", async () => {
    const errorMessage = "Failed to fetch engineer tasks";
    apiClient.get.mockRejectedValueOnce({ response: { data: errorMessage } });

    await store.dispatch(fetchEngineerTasks("engineer@test.com"));
    expect(store.getState().engineer.error).toBe(errorMessage);
  });

  test("fetchUpdateEngineerProfile should handle error", async () => {
    const errorMessage = "Failed to update engineer profile";
    apiClient.patch.mockRejectedValueOnce({ response: { data: errorMessage } });

    await store.dispatch(
      fetchUpdateEngineerProfile({
        email: "engineer@test.com",
        updatedData: {},
      })
    );
    expect(store.getState().engineer.error).toBe(errorMessage);
  });
});