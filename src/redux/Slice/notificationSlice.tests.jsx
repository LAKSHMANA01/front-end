import { configureStore } from "@reduxjs/toolkit";
import notificationReducer, {
  fetchNotifications,
  markAsRead,
  sendNotification,
} from "./notificationSlice";
import axios from "axios";

jest.mock("axios");

describe("Notification Slice Async Thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { notifications: notificationReducer },
    });
    jest.clearAllMocks();
  });

  test("fetchNotifications should fetch unread notifications", async () => {
    const mockNotifications = [
      { _id: "1", message: "Test notification 1", isRead: false },
      { _id: "2", message: "Test notification 2", isRead: false },
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        notifications: [
          ...mockNotifications,
          { _id: "3", message: "Read notification", isRead: true },
        ],
      },
    });

    await store.dispatch(fetchNotifications("marina@gmail.com"));

    expect(axios.get).toHaveBeenCalledWith(
      "https://localhost:8003/api/notifications/getNotifications/marina@gmail.com"
    );
    expect(store.getState().notifications.notifications).toEqual(mockNotifications);
    expect(store.getState().notifications.loading).toBe(false);
  });

  test("fetchNotifications should handle error", async () => {
    const errorMessage = "Failed to fetch notifications";
    axios.get.mockRejectedValueOnce({
      response: {
        data: errorMessage,
      },
    });

    await store.dispatch(fetchNotifications("marina@gmail.com"));

    expect(store.getState().notifications.error).toBe(errorMessage);
    expect(store.getState().notifications.loading).toBe(false);
  });

  test("markAsRead should remove notification from state", async () => {
    const initialNotifications = [
      { _id: "67b8114bfa70ebf5e966cb18", message: "Test notification", isRead: false },
    ];

    // Directly setting initial state
    store.getState().notifications.notifications = initialNotifications;

    axios.patch.mockResolvedValueOnce({});

    await store.dispatch(markAsRead("67b8114bfa70ebf5e966cb18"));

    expect(axios.patch).toHaveBeenCalledWith(
      "https://localhost:8003/api/notifications/updateNotification/67b8114bfa70ebf5e966cb18",
      { isRead: true }
    );
    expect(store.getState().notifications.notifications).toEqual([]);
  });

  test("markAsRead should handle error", async () => {
    const errorMessage = "Failed to mark notification as read";
    axios.patch.mockRejectedValueOnce({
      response: {
        data: errorMessage,
      },
    });

    await store.dispatch(markAsRead("67b8114bfa70ebf5e966cb18"));
    expect(store.getState().notifications.error).toBe(errorMessage);
  });

  test("sendNotification should send notification successfully", async () => {
    const notificationData = {
      email: "marina@gmail.com",
      messageToSend: "Test message",
      isRead: false,
    };

    axios.post.mockResolvedValueOnce({});

    await store.dispatch(sendNotification(notificationData));

    expect(axios.post).toHaveBeenCalledWith(
      "https://localhost:8003/api/notifications/addNotification",
      {
        email: notificationData.email,
        message: notificationData.messageToSend,
        isRead: notificationData.isRead,
      }
    );
  });

  test("sendNotification should handle error", async () => {
    const errorMessage = "Failed to send notification";
    const notificationData = {
      email: "marina@gmail.com",
      messageToSend: "Test message",
      isRead: false,
    };

    axios.post.mockRejectedValueOnce({
      response: {
        data: errorMessage,
      },
    });

    await store.dispatch(sendNotification(notificationData));
    expect(store.getState().notifications.error).toBe(errorMessage);
  });

  test("notifications loading state should be true while fetching", () => {
    store.dispatch(fetchNotifications("marina@gmail.com")); // Don't await
    expect(store.getState().notifications.loading).toBe(true);
  });

  test("fetchNotifications should handle empty notifications", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        notifications: [],
      },
    });

    await store.dispatch(fetchNotifications("marina@gmail.com"));

    expect(store.getState().notifications.notifications).toEqual([]);
    expect(store.getState().notifications.loading).toBe(false);
  });
});
