import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("shophub_user")) ?? null;

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    error: null,
    user: savedUser,                          // ← survives refresh
  },
  reducers: {
    loginStart(state) { state.loading = true; state.error = null; },
    loginSuccess(state, { payload }) {
      state.loading = false;
      state.user = payload;
      localStorage.setItem("shophub_user", JSON.stringify(payload)); // ← persist
    },
    loginFailure(state, { payload }) { state.loading = false; state.error = payload; },
    loginReset(state) {
      state.loading = false; state.error = null; state.user = null;
      localStorage.removeItem("shophub_user");  // ← clear on logout
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, loginReset } =
  loginSlice.actions;

export default loginSlice.reducer;