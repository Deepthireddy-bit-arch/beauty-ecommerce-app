// src/redux/slices/registerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    success: false,
    error: null,
    user: null,
  },
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, { payload }) {
      state.loading = false;
      state.success = true;
      state.user = payload;
    },
    registerFailure(state, { payload }) {
      state.loading = false;
      state.error = payload;
    },
    registerReset(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.user = null;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  registerReset,
} = registerSlice.actions;

export default registerSlice.reducer;