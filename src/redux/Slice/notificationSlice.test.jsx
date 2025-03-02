// NotificationSlice.full.test.jsx
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer, {
  fetchNotifications,
  markAsRead,
  sendNotification,
} from "./notificationSlice";
import axios from "axios";

jest.mock("axios");

// Helper: Create a test store using a middleware callback
function setupStore(preloadedState) {
  return configureStore({
    reducer: { notifications: notificationReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState,
  });
}

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

describe("Notification Slice", () => {
  let store;
  beforeEach(() => {
    store = setupStore({ notifications: initialState });
    jest.clearAllMocks();
  });

  // --- Reducer Tests (Direct) ---
  describe("Reducer", () => {
    it("returns the initial state", () => {
      expect(notificationReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it("handles fetchNotifications.pending", () => {
      const action = { type: fetchNotifications.pending.type };
      const state = notificationReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("handles fetchNotifications.fulfilled", () => {
      const filteredNotifs = [{ _id: "1", isRead: false }];
      const action = { type: fetchNotifications.fulfilled.type, payload: filteredNotifs };
      const state = notificationReducer({ ...initialState, loading: true }, action);
      expect(state.notifications).toEqual(filteredNotifs);
      expect(state.loading).toBe(false);
    });

    it("handles fetchNotifications.rejected", () => {
      const action = { type: fetchNotifications.rejected.type, payload: "Fetch error" };
      const state = notificationReducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual("Fetch error");
      expect(state.loading).toBe(false);
    });

    it("handles markAsRead.fulfilled", () => {
      const initState = {
        notifications: [{ _id: "1", isRead: false }, { _id: "2", isRead: false }],
        loading: false,
        error: null,
      };
      const action = { type: markAsRead.fulfilled.type, payload: "1" };
      const state = notificationReducer(initState, action);
      expect(state.notifications).toEqual([{ _id: "2", isRead: false }]);
    });

    it("handles sendNotification.rejected", () => {
      const action = { type: sendNotification.rejected.type, payload: "Post error" };
      const state = notificationReducer({ ...initialState, loading: true }, action);
      expect(state.error).toEqual("Post error");
      expect(state.loading).toBe(false);
    });
  });

  // --- Async Thunk Tests ---
  describe("Async Thunks", () => {
    describe("fetchNotifications", () => {
      it("dispatches fulfilled and updates state with unread notifications", async () => {
        // Prepare axios response with a mix of read/unread notifications.
        const allNotifications = [
          { _id: "1", isRead: false },
          { _id: "2", isRead: true },
          { _id: "3", isRead: false },
        ];
        axios.get.mockResolvedValueOnce({ data: { notifications: allNotifications } });
        const email = "user@example.com";
        // Call thunk with two parameters (userId and email)
        const result = await store.dispatch(fetchNotifications("dummyUserId", email));
        expect(result.type).toBe("notifications/fetchNotifications/fulfilled");
        expect(result.payload).toEqual([
          { _id: "1", isRead: false },
          { _id: "3", isRead: false },
        ]);
        const state = store.getState().notifications;
        expect(state.notifications).toEqual([
          { _id: "1", isRead: false },
          { _id: "3", isRead: false },
        ]);
        expect(state.loading).toBe(false);
      });

      it("dispatches rejected when axios.get fails", async () => {
        axios.get.mockRejectedValueOnce({ response: { data: "Fetch error" } });
        const email = "user@example.com";
        const result = await store.dispatch(fetchNotifications("dummyUserId", email));
        expect(result.type).toBe("notifications/fetchNotifications/rejected");
        const state = store.getState().notifications;
        expect(state.error).toEqual("Fetch error");
        expect(state.loading).toBe(false);
      });
    });

    describe("markAsRead", () => {
      it("dispatches fulfilled and removes the notification", async () => {
        // Preload state with notifications
        store = setupStore({
          notifications: {
            notifications: [{ _id: "1", isRead: false }, { _id: "2", isRead: false }],
            loading: false,
            error: null,
          },
        });
        axios.patch.mockResolvedValueOnce({}); // patch returns no data
        const result = await store.dispatch(markAsRead("1"));
        expect(result.type).toBe("notifications/markAsRead/fulfilled");
        expect(result.payload).toBe("1");
        const state = store.getState().notifications;
        expect(state.notifications).toEqual([{ _id: "2", isRead: false }]);
      });

      it("dispatches rejected when axios.patch fails", async () => {
        axios.patch.mockRejectedValueOnce({ response: { data: "Patch error" } });
        const result = await store.dispatch(markAsRead("1"));
        expect(result.type).toBe("notifications/markAsRead/rejected");
        // Note: since the slice doesn't handle markAsRead.rejected, state.error remains unchanged.
        const state = store.getState().notifications;
        expect(state.error).toBeNull();
      });
    });

    describe("sendNotification", () => {
      it("dispatches fulfilled when axios.post succeeds (no state change)", async () => {
        axios.post.mockResolvedValueOnce({ data: {} });
        const result = await store.dispatch(sendNotification({ messageToSend: "Hello", isRead: false }));
        expect(result.type).toBe("notifications/sendNotification/fulfilled");
        // Fulfilled case does not update state so notifications remain unchanged.
        const state = store.getState().notifications;
        expect(state.notifications).toEqual([]);
        expect(state.loading).toBe(false);
      });
      it("dispatches rejected when axios.post fails", async () => {
        axios.post.mockRejectedValueOnce({ response: { data: "Post error" } });
        const result = await store.dispatch(sendNotification({ messageToSend: "Hello", isRead: false }));
        expect(result.type).toBe("notifications/sendNotification/rejected");
        const state = store.getState().notifications;
        expect(state.error).toEqual("Post error");
      });
    });
  });
});