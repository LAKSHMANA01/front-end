import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../../utils/apiClient';

// AsyncThunk for fetching engineer tasks

export const fetchProfile = createAsyncThunk(
  'tickets/fetchProfile',
  async ({ userEmail, role }) => {
    console.log(`Fetching ${userEmail}`);
    console.log(`userId inside fetchProfile ticketSlice: ${userEmail}`);
    const response = await apiClient.get(`/profile/${role}/${userEmail}`);
    console.log(`response.data inside profile: ${response.data}`);
    return response.data;
  }
);

export const fetchEngineerTasks = createAsyncThunk(
  'engineer/fetchEngineerTasks',
  async (email, { rejectWithValue }) => {
    console.log(`email inside fetchEngineerTasks: ${email}`);
    try {
      const response = await apiClient.get(`/tasks/engineer/${email}`);
      console.log(`response.data inside fetchEngineerTasks: ${response.data}`);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch engineer tasks');
    }
  }
);

export const fetchAcceptTask = createAsyncThunk(
  'engineer/fetchAcceptTask',
  async ({ taskId, email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/accept/${email}`);
      return { taskId, updatedTask: response.data.ticket };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to accept task');
    }
  }
);

export const fetchRejectTask = createAsyncThunk(
  'engineer/fetchRejectTask',
  async ({ taskId, email }, { rejectWithValue }) => {
    try {
      await apiClient.post(`/tasks/${taskId}/reject/${email}`);
      return { taskId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reject task');
    }
  }
);

// AsyncThunk for updating engineer profile
export const fetchUpdateEngineerProfile = createAsyncThunk(
  'engineer/fetchUpdateEngineerProfile',
  async ({ email, updatedData }, { rejectWithValue }) => {
    console.log('updatedData inside fetchUpdateEngineerProfile: ',updatedData);
    try {
      const response = await apiClient.patch(
        `/updateProfile/engineer/${email}`, 
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

// AsyncThunk for updating engineer profile
export const fetchEngineerProfiledata = createAsyncThunk(
  'engineerfetchEngineerProfiledata',
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
  "engineer/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/tasks/updateTicketStatus/${taskId}`, { status });
      return response.data; // Return only serializable data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const HazardsTickets = createAsyncThunk(
   'engineer/fetchHazardsTickets',
  async ({ rejectWithValue }) => {
    try {
      console.log("data comeing in axio")
      const response =  await axios.get(`https://localhost:8000/api/hazards/getAllHazards`);
      console.log("response.data inside fetchEngineerTasks:",response.data);
      return response.data; // Return updated task info
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// AsyncThunk for Harzards engineer updateing
export const HazardsUpdateTickets = createAsyncThunk(
  'engineer/HazardsUpdateTickets',
  async (updatedData, { rejectWithValue }) => {
    console.log("updatedData inside fetchUpdateHazardsUpdateTickets:", updatedData);
    try {
      const response = await axios.patch(
        `https://localhost:8000/api/hazards/updateHazard/${updatedData._id}`, 
        updatedData, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const res = await axios.get(`https://localhost:8000/api/hazards/getAllHazards`);
      console.log("response.data inside  Hazards :", response.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to HazardsUpdateTickets');
    }
  }
);
// AsyncThunk for Harzards engineer updateing
export const HazardsDeleteTickets = createAsyncThunk(
  'engineer/HazardsDeleteTickets',
  async (updatedData, { rejectWithValue }) => {
    console.log("deletedData inside fetchUpdateHazardsUpdateTickets:", updatedData);
    try {
      const response = await axios.delete(
        `https://localhost:8000/api/hazards/deleteHazard/${updatedData}`, 
       
      );
      const res = await axios.get(`https://localhost:8000/api/hazards/getAllHazards`);
      console.log("response.data inside  Hazards :", response.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to HazardsUpdateTickets');
    }
  }
);


const engineerSlice = createSlice({
  name: 'engineer',
  initialState: {
    tasks: [],
    updateProfile: [],
    profiledata: {},
    Hazards:[],
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

      .addCase(fetchAcceptTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptTask.fulfilled, (state, action) => {
        const { taskId, updatedTask } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task._id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = updatedTask;
        }
        state.loading = false;
      })
      .addCase(fetchAcceptTask.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchRejectTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRejectTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId);
        state.loading = false;
      })
      .addCase(fetchRejectTask.rejected, (state, action) => {
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

       // For fetchEngineerProfiledata
       .addCase(fetchEngineerProfiledata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineerProfiledata.fulfilled, (state, action) => {
        state.updateProfile = action.payload;
        state.loading = false;
      })
      .addCase(fetchEngineerProfiledata.rejected, (state, action) => {
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
      })
      // Hazards data setting here 
      .addCase( HazardsTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase( HazardsTickets.fulfilled, (state, action) => {
        state.Hazards = action.payload;
        console.log("data comeing in fulfilled")
        state.loading = false;
      })
      .addCase( HazardsTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Hazards  update dat patch to engineer
      .addCase( HazardsUpdateTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(HazardsUpdateTickets.fulfilled, (state, action) => {
        state.Hazards = action.payload;
        console.log("data comeing inside udpate Hazards patch")
        state.loading = false;
      })
      .addCase( HazardsUpdateTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

     // Hazards delete tasks
      .addCase( HazardsDeleteTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(HazardsDeleteTickets.fulfilled, (state, action) => {
        state.Hazards = action.payload;
         
        
        console.log("data comeing inside deleting data delete")
        state.loading = false;
      })
      .addCase( HazardsDeleteTickets.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export default engineerSlice.reducer;
