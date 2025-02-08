import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create AsyncThunk for fetching tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (userId) => {
    console.log(`userId inside fetchTickets ticketSlice: ${userId}`);
    const response = await axios.get(`https://localhost:8000/api/tickets/user/${userId}`);
    console.log(`response.data inside ticketSlice: ${response.data}`);
    return response.data;
  }
);

// AsyncThunk for updating profile
export const fetchUpdateProfile = createAsyncThunk(
  'UpdateProfile/fetchTickets', // The action type should be descriptive (UpdateProfile instead of fetchTickets)
  async (updatedata, { rejectWithValue }) => {
    console.log(`updatedata inside fetchUpdateProfile ticketSlice: ${updatedata}`);
    try {
      console.log("data is comeing update data")
      const response = await axios.patch(`https://localhost:8000/api/updateProfile/user/2`, updatedata, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`response.data inside fetchUpdateProfile ticketSlice: ${response.data}`);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue(
        error.response?.data || 'Failed to update profile'
      );
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tasks: [],
    updateProfile: [],
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
        state.error = action.error.message;
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
        state.error = action.payload; // Use action.payload for errors
        state.loading = false;
      });
  },
});

export default ticketSlice.reducer;
