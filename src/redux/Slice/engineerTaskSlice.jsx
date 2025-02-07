import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// AsyncThunk for fetching engineer tasks
export const fetchEngineerTasks = createAsyncThunk(
  'engineerTasks/fetchEngineerTasks',
  async ( userId ,{ rejectWithValue }) => {
    console.log("userid from asyncthunk")
    try {                   

      const response = await axios(`https://localhost:8000/api/tickets/engineer/${userId}`);
      console.log("userid  data", response.data)
      return response.data;

    } catch (error) {
      // Return a rejected value to handle errors
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const engineerTaskSlice = createSlice({
  name: 'engineerTasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEngineerTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineerTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchEngineerTasks.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      });
  },
});

export default engineerTaskSlice.reducer;
