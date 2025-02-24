import { configureStore } from "@reduxjs/toolkit";
import adminReducer, {
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
import apiClient from "../../utils/apiClient";


jest.mock("../../utils/apiClient");

describe("Admin Slice Async Thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { admin: adminReducer }
    });
  });

  test("fetchAllTasks should fetch tasks and update state", async () => {
    const mockTasks = [{ id: 1, name: "Task 1" }];
    apiClient.get.mockResolvedValueOnce({ data: mockTasks });

    await store.dispatch(fetchAllTasks());
    expect(store.getState().admin.tasks).toEqual(mockTasks);
  });

  test("fetchAllTasks should handle error when fetching tasks fails", async () => {
    const errorResponse = { response: { data: "Failed to fetch tasks" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchAllTasks());
    expect(store.getState().admin.error).toEqual("Failed to fetch tasks");
  });

  test("fetchAllUsers should fetch users and update state", async () => {
    const mockUsers = [{ id: 1, name: "User 1" }];
    apiClient.get.mockResolvedValueOnce({ data: mockUsers });

    await store.dispatch(fetchAllUsers());
    expect(store.getState().admin.users).toEqual(mockUsers);
  });

  test("fetchAllUsers should handle error when fetching users fails", async () => {
    const errorResponse = { response: { data: "Failed to fetch users" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchAllUsers());
    expect(store.getState().admin.error).toEqual("Failed to fetch users");
  });

  test("fetchAllApprovedEngineers should update state with engineers", async () => {
    const mockEngineers = [{ email: "engineer@test.com", approved: true }];
    apiClient.get.mockResolvedValueOnce({ data: mockEngineers });

    await store.dispatch(fetchAllApprovedEngineers());
    expect(store.getState().admin.approvedEngineers).toEqual(mockEngineers);
  });

  test("fetchAllApprovedEngineers should handle error when fetching engineers fails", async () => {
    const errorResponse = { response: { data: "Failed to fetch engineers" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchAllApprovedEngineers());
    expect(store.getState().admin.error).toEqual("Failed to fetch engineers");
  });

  test("fetchAllEngineers should update state with engineers", async () => {
    const mockEngineers = [{ email: "engineer@test.com", approved: false }];
    apiClient.get.mockResolvedValueOnce({ data: { approvalEngineers: mockEngineers } });

    await store.dispatch(fetchAllEngineers());
    expect(store.getState().admin.engineers).toEqual(mockEngineers);
  });

  test("fetchAllEngineers should handle error when fetching engineers fails", async () => {
    const errorResponse = { response: { data: "Failed to fetch engineers" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchAllEngineers());
    expect(store.getState().admin.error).toEqual("Failed to fetch engineers");
  });

  test("approveEngineer should update state correctly", async () => {
    const mockEngineer = { email: "engineer@test.com", approved: true };
    apiClient.patch.mockResolvedValueOnce({ data: { engineer: mockEngineer } });

    await store.dispatch(approveEngineer({ engineerEmail: "engineer@test.com", approve: true }));
    expect(store.getState().admin.approvedEngineers).toContainEqual(mockEngineer);
  });

  test("approveEngineer should handle error when approving engineer fails", async () => {
    const errorResponse = { response: { data: "Failed to update engineer approval" } };
    apiClient.patch.mockRejectedValueOnce(errorResponse);
    await store.dispatch(approveEngineer({ engineerEmail: "engineer@test.com", approve: true }));
    expect(store.getState().admin.error).toEqual("Failed to update engineer approval");
  });

  test("fetchDeferredTasks should update deferredTasks in state", async () => {
    const mockDeferredTasks = [{ id: 1, status: "deferred" }];
    apiClient.get.mockResolvedValueOnce({ data: mockDeferredTasks });

    await store.dispatch(fetchDeferredTasks());
    expect(store.getState().admin.deferredTasks).toEqual(mockDeferredTasks);
  });

  test("fetchDeferredTasks should handle error when fetching deferred tasks fails", async () => {
    const errorResponse = { response: { data: "Failed to fetch deferred tasks" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchDeferredTasks());
    expect(store.getState().admin.error).toEqual("Failed to fetch deferred tasks");
  });

  test("fetchAvailableEngineers should update availableEngineers in state", async () => {
    const mockEngineers = [{ id: 1, name: "Engineer 1" }];
    apiClient.get.mockResolvedValueOnce({ data: { engineers: mockEngineers } });

    await store.dispatch(fetchAvailableEngineers());
    expect(store.getState().admin.availableEngineers).toEqual(mockEngineers);
  });

  test("fetchAvailableEngineers should handle error when fetching available engineers fails", async () => {
    const error = new Error("Failed to fetch available engineers");
    apiClient.get.mockRejectedValueOnce(error);
    await store.dispatch(fetchAvailableEngineers());
    expect(store.getState().admin.error).toEqual("Failed to fetch available engineers");
  });

  test("reassignTicket should reassign a ticket successfully", async () => {
    const mockResponse = { success: true };
    apiClient.patch.mockResolvedValueOnce({ data: mockResponse });

    await store.dispatch(reassignTicket({ ticketId: 1, engineerId: 2 }));
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/reassign/1/2",
      {},
      { headers: { "Content-Type": "application/json" } }
    );
  });

  test("reassignTicket should handle error when reassigning ticket fails", async () => {
    const error = new Error("Failed to reassign ticket");
    apiClient.patch.mockRejectedValueOnce(error);
    
    await expect(store.dispatch(reassignTicket({ ticketId: 1, engineerId: 2 }))).rejects.toThrow("Failed to reassign ticket");
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/reassign/1/2",
      {},
      { headers: { "Content-Type": "application/json" } }
    );
  });

  test("fetchEngineerTasks should update engineerTasks in state", async () => {
    const mockTasks = [{ id: 1, title: "Task for Engineer" }];
    apiClient.get.mockResolvedValueOnce({ data: mockTasks });

    await store.dispatch(fetchEngineerTasks("engineer@test.com"));
    expect(store.getState().admin.engineerTasks).toEqual(mockTasks);
  });

  test("fetchEngineerTasks should handle error when fetching engineer tasks fails", async () => {
    const errorResponse = { response: { data: "Error fetching tasks" } };
    apiClient.get.mockRejectedValueOnce(errorResponse);
    await store.dispatch(fetchEngineerTasks("engineer@test.com"));
    expect(store.getState().admin.error).toEqual("Error fetching tasks");
  });
});