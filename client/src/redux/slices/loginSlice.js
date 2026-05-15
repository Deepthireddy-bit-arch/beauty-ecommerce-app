// src/redux/slices/loginSlice.js 
// defines the data shape + how it changes
import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, { payload }) {
      state.loading = false;
      state.user = payload;
    },
    loginFailure(state, { payload }) {
      state.loading = false;
      state.error = payload;
    },
    loginReset(state) {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, loginReset } =
  loginSlice.actions;

export default loginSlice.reducer;