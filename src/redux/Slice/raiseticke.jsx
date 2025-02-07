import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const submitTicket = createAsyncThunk(
  'tickets/submitTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      console.log("inside data")
      const response = await axios.post(
        ' https://localhost:8000/api/users/raiseTicket/2',
        ticketData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error submitting ticket:", error);
      return rejectWithValue(
        error.response?.data || 'Failed to submit ticket'
      );
    }
  }
);

// Redux slice for tickets
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    errorMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.push(action.payload); // Add the ticket to the data array
      })
      .addCase(submitTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default ticketSlice.reducer;
