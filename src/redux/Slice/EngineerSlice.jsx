import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// AsyncThunk for fetching engineer tasks
export const fetchEngineerTasks = createAsyncThunk(
  'engineer/fetchEngineerTasks',
  async (userId, { rejectWithValue }) => {
    console.log(`userId inside fetchEngineerTasks: ${userId}`);
    try {
      const response = await axios.get(`https://localhost:8000/api/tickets/engineer/${userId}`);
      console.log(`response.data inside fetchEngineerTasks: ${response.data}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch engineer tasks');
    }
  }
);

// AsyncThunk for updating engineer profile
export const fetchUpdateEngineerProfile = createAsyncThunk(
  'engineer/fetchUpdateEngineerProfile',
  async (updatedData, { rejectWithValue }) => {
    console.log(`updatedData inside fetchUpdateEngineerProfile: ${updatedData}`);
    try {
      const response = await axios.patch(
        `https://localhost:8000/api/updateProfile/engineer/3`, 
        updatedData, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`response.data inside fetchUpdateEngineerProfile: ${response.data}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update engineer profile');
    }
  }
);
export const updateTaskStatus = createAsyncThunk(
  'engineer/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`https://localhost:8000/api/tasks/updateTicketStatus/${taskId}/status/${status}`);
      return { response };  // Return updated task info
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const engineerSlice = createSlice({
  name: 'engineer',
  initialState: {
    tasks: [],
    updateProfile: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For fetchEngineerTasks
      .addCase(fetchEngineerTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineerTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchEngineerTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // For fetchUpdateEngineerProfile
      .addCase(fetchUpdateEngineerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateEngineerProfile.fulfilled, (state, action) => {
        state.updateProfile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpdateEngineerProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, status } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task._id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].status = status;  // Update status locally
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default engineerSlice.reducer;
