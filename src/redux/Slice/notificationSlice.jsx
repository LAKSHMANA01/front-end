import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch notifications (Async Action)
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("data nofification", userId)
      const response = await axios.get(`https://localhost:8003/api/notifications/getNotifications/marina@gmail.com`);
      console.log("Here Fetchnotification here",response)
      return response.data.notifications.filter((notif) => !notif.isRead);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Mark notification as read (Async Action)

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      console.log("notification marked as read");
      await axios.patch(`https://localhost:8003/api/notifications/updateNotification/67b8114bfa70ebf5e966cb18`, { isRead: true } );
      return "marina@gmail.com" ; // Return the ID to update state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Send notification (Async Action)
export const sendNotification = createAsyncThunk(
  "notifications/sendNotification",
  async ({ email, messageToSend, isRead }, { rejectWithValue }) => {
    try {
      const notificationData = { email, message: messageToSend, isRead };
      await axios.post("https://localhost:8003/api/notifications/addNotification", notificationData);
      
    } catch (error) {

      return rejectWithValue(error.response.data);
    }
  }
);

// Notification Slice
const notificationSlice = createSlice({
  name: "notifications", // name of the notification
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Handle fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notif) => notif._id !== action.payload
        );
      })

      // Handle sendNotification (Optional Success Feedback)
      .addCase(sendNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export default notificationSlice.reducer;
