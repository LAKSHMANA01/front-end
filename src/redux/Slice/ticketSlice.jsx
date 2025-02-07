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
const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default ticketSlice.reducer;
