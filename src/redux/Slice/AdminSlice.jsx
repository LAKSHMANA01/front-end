import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../../utils/apiClient";

// Fetch all tasks
export const fetchAllTasks = createAsyncThunk('admin/tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/admin/tasks'); // Replace with your API
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch tasks");
  }
});

// Fetch all users
export const fetchAllUsers = createAsyncThunk('admin/users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/admin/users'); // Replace with your API
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

export const fetchAllApprovedEngineers = createAsyncThunk("admin/fetchAllApprovedEngineers",async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/engineers"); // Replace with your API
      //console.log("Approved Engineers Response:", response.data); // Debugging
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch engineers");
    }
  }
);

export const fetchAllEngineers = createAsyncThunk("admin/fetchAllEngineers", async(_, {rejectWithValue}) => {
  try{
    const response = await apiClient.get("/admin/approval/engineers");
    // if (!Array.isArray(response.data.approvalEngineers)) {
    //   throw new Error("Invalid data format");
    // }
    
    return response.data.approvalEngineers; //this approvalEngineers is from backend API
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to fetch engineers");
  }
});

export const approveEngineer = createAsyncThunk("admin/approveEngineer", async ({engineerEmail, approve},{rejectWithValue}) =>{
  try{
    const response = await apiClient.patch(`/admin/approve-engineer/${engineerEmail}`, 
      {
        email: engineerEmail,
        approve
      });
    return response.data;
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to update engineer approval");
  }
})

export const fetchDeferredTasks = createAsyncThunk(
  "admin/deferredTasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://localhost:8000/api/admin/status/deferred"); // Replace with your API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch deferred tasks");
    }
  }
);

// Fetch available engineers
export const fetchAvailableEngineers = createAsyncThunk(
  'tasks/fetchAvailableEngineers',
  async () => {
    try {
      const response = await axios.get('/api/engineers/available');
      return response.data.engineers; // Assuming API returns an array of engineers
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message); // Handle error
    }
  }
);

// Reassign ticket to an engineer
export const reassignTicket = createAsyncThunk(
  'tasks/reassignTicket',
  async ({ ticketId, engineerId }) => {
    try {
      const response = await axios.patch(`/api/reassign/${ticketId}/${engineerId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Assuming the response has details of reassigned ticket
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message); // Handle error
    }
  }
);

export const fetchEngineerTasks = createAsyncThunk(
  "admin/fetchEngineerTasks",
  async (engineerEmail, { rejectWithValue }) => {
    try {
      console.log("engineerEmail", engineerEmail);
      const response = await apiClient.get(`/tasks/engineer/${engineerEmail}`); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching tasks");
    }
  }
);


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    tasks: [],
    engineerTasks:[],
    completedTasks: [],
    deferredTasks: [],
    users: [],
    engineers: [],
    approvedEngineers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllApprovedEngineers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllApprovedEngineers.fulfilled, (state, action) => {
        state.approvedEngineers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllApprovedEngineers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeferredTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeferredTasks.fulfilled, (state, action) => {
        state.deferredTasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeferredTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchEngineerTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineerTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.engineerTasks = action.payload;
      })
      .addCase(fetchEngineerTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching tasks.";
      })
      .addCase(fetchAvailableEngineers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableEngineers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableEngineers = action.payload;
      })
      .addCase(fetchAvailableEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllEngineers.pending, (state) =>{
        state.loading=true;
        state.error = null;
      })
      .addCase(fetchAllEngineers.fulfilled, (state, action) =>{
        state.engineers=Array.isArray(action.payload) ? action.payload : [];
        state.loading=false;
      })
      .addCase(fetchAllEngineers.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveEngineer.pending, (state) =>{
        state.loading =true;
        state.error = null;
      })
      .addCase(approveEngineer.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEngineer = action.payload.engineer;
    
        if (!updatedEngineer) return; // Ensure there's an engineer to update
    
        // Update engineers list
        state.engineers = state.engineers.map((engineer) =>
            engineer.email === updatedEngineer.email ? updatedEngineer : engineer
        );
    
        // Ensure approvedEngineers list exists
        if (!state.approvedEngineers) {
            state.approvedEngineers = [];
        }
    
        // Add to approved list if not already there
        const engineerExists = state.approvedEngineers.some(
            (e) => e.email === updatedEngineer.email
        );
        if (!engineerExists) {
            state.approvedEngineers.push(updatedEngineer);
        }
    })
    
      
      .addCase(approveEngineer.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
