import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all tasks
export const fetchAllTasks = createAsyncThunk('admin/tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://localhost:8000/api/admin/tasks'); // Replace with your API
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch tasks");
  }
});

// Fetch all users
export const fetchAllUsers = createAsyncThunk('admin/users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://localhost:8000/api/admin/users'); // Replace with your API
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

export const fetchAllEngineers = createAsyncThunk("admin/engineers/fetchAll",async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://localhost:8000/api/admin/engineers"); // Replace with your API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch engineers");
    }
  }
);

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


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    tasks: [],
    completedTasks: [],
    deferredTasks: [],
    users: [],
    engineers: [],
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
      .addCase(fetchAllEngineers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEngineers.fulfilled, (state, action) => {
        state.engineers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllEngineers.rejected, (state, action) => {
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
      });
  },
});

export default adminSlice.reducer;
