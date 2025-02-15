import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: null,
    role: null,
  },
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = { email: null, role: null };
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
