import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// AsyncThunk for fetching tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async ({ userEmail, role }) => {
    console.log(`userId inside fetchTickets ticketSlice: ${userEmail}`);
    const response = await apiClient.get(`/tickets/${role}/${userEmail}`);
    console.log(`response.data inside ticketSlice: ${response.data}`);
    return response.data;
  }
);

// AsyncThunk for fetching profile
export const fetchProfile = createAsyncThunk(
  'tickets/fetchProfile',
  async ({ userEmail, role }) => {
    console.log(`userId inside fetchProfile ticketSlice: ${userEmail}`);
    const response = await apiClient.get(`/profile/${role}/${userEmail}`);
    console.log(`response.data inside profile: ${response.data}`);
    return response.data;
  }
);

// AsyncThunk for updating profile
export const fetchUpdateProfile = createAsyncThunk(
  'tickets/updateProfile',
  async ({ userEmail, role, updatedata }, { rejectWithValue }) => {
    console.log(`updatedata inside fetchUpdateProfile ticketSlice: ${JSON.stringify(updatedata)}`);
    try {
      const response = await apiClient.patch(
        `/updateProfile/${role}/${userEmail}`,
        updatedata,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log(`response.data inside fetchUpdateProfile ticketSlice: ${response.data}`);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tasks: [],
    profile: {},
    updateProfile: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For fetchTickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // For fetchUpdateProfile
      .addCase(fetchUpdateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
        state.updateProfile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpdateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // For fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default ticketSlice.reducer;
