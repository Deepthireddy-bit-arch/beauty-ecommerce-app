// // // import { createSlice } from "@reduxjs/toolkit";

// // // const savedUser = JSON.parse(localStorage.getItem("shophub_user")) ?? null;

// // // const loginSlice = createSlice({
// // //   name: "login",
// // //   initialState: {
// // //     loading: false,
// // //     error: null,
// // //     user: savedUser,                          // ← survives refresh
// // //   },
// // //   reducers: {
// // //     loginStart(state) { state.loading = true; state.error = null; },
// // //     loginSuccess(state, { payload }) {
// // //       state.loading = false;
// // //       state.user = payload;
// // //       localStorage.setItem("shophub_user", JSON.stringify(payload)); // ← persist
// // //     },
// // //     loginFailure(state, { payload }) { state.loading = false; state.error = payload; },
// // //     loginReset(state) {
// // //       state.loading = false; state.error = null; state.user = null;
// // //       localStorage.removeItem("shophub_user");  // ← clear on logout
// // //     },
// // //   },
// // // });

// // // export const { loginStart, loginSuccess, loginFailure, loginReset } =
// // //   loginSlice.actions;

// // // export default loginSlice.reducer;
// // import { createSlice } from "@reduxjs/toolkit";

// // const savedUser = JSON.parse(localStorage.getItem("shophub_user")) ?? null;
// // const savedToken = localStorage.getItem("shophub_token") ?? null;

// // const loginSlice = createSlice({
// //   name: "login",
// //   initialState: {
// //     loading: false,
// //     error: null,
// //     user: savedUser,
// //     token: savedToken,
// //     isAuthenticated: !!savedUser && !!savedToken, // Add this for easy checking
// //   },
// //   reducers: {
// //     loginStart(state) { 
// //       state.loading = true; 
// //       state.error = null; 
// //     },
// //     loginSuccess(state, { payload }) {
// //       state.loading = false;
// //       state.user = payload.user || payload; // Handle both formats
// //       state.token = payload.token;
// //       state.isAuthenticated = true;
// //       state.error = null;
      
// //       // Save to localStorage
// //       localStorage.setItem("shophub_user", JSON.stringify(state.user));
// //       if (payload.token) {
// //         localStorage.setItem("shophub_token", payload.token);
// //       }
// //     },
// //     loginFailure(state, { payload }) { 
// //       state.loading = false; 
// //       state.error = payload; 
// //       state.isAuthenticated = false;
// //     },
// //     logout(state) {
// //       state.loading = false;
// //       state.error = null;
// //       state.user = null;
// //       state.token = null;
// //       state.isAuthenticated = false;
      
// //       // Clear localStorage
// //       localStorage.removeItem("shophub_user");
// //       localStorage.removeItem("shophub_token");
// //     },
// //     resetLoginState(state) {
// //       state.loading = false;
// //       state.error = null;
// //     },
// //   },
// // });

// // export const { 
// //   loginStart, 
// //   loginSuccess, 
// //   loginFailure, 
// //   loginReset,
// //   logout,
// //   resetLoginState 
// // } = loginSlice.actions;

// // export default loginSlice.reducer;
// import { createSlice } from "@reduxjs/toolkit";

// const savedUser = JSON.parse(localStorage.getItem("shophub_user")) ?? null;
// const savedToken = localStorage.getItem("shophub_token") ?? null;

// const loginSlice = createSlice({
//   name: "login",
//   initialState: {
//     loading: false,
//     error: null,
//     user: savedUser,
//     token: savedToken,
//     isAuthenticated: !!savedUser && !!savedToken,
//   },
//   reducers: {
//     loginStart(state) { 
//       state.loading = true; 
//       state.error = null; 
//     },
//     loginSuccess(state, { payload }) {
//       state.loading = false;
//       state.user = payload.user || payload;
//       state.token = payload.token;
//       state.isAuthenticated = true;
//       state.error = null;
      
//       localStorage.setItem("shophub_user", JSON.stringify(state.user));
//       if (payload.token) {
//         localStorage.setItem("shophub_token", payload.token);
//       }
//     },
//     loginFailure(state, { payload }) { 
//       state.loading = false; 
//       state.error = payload; 
//       state.isAuthenticated = false;
//     },
//     // Make sure this is exported
//     loginReset(state) {  // ← This is the function you need
//       state.loading = false;
//       state.error = null;
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
      
//       localStorage.removeItem("shophub_user");
//       localStorage.removeItem("shophub_token");
//     },
//     // Or use logout if you prefer
//     logout(state) {
//       state.loading = false;
//       state.error = null;
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
      
//       localStorage.removeItem("shophub_user");
//       localStorage.removeItem("shophub_token");
//     },
//     resetLoginState(state) {
//       state.loading = false;
//       state.error = null;
//     },
//   },
// });

// // Make sure you're exporting loginReset
// export const { 
//   loginStart, 
//   loginSuccess, 
//   loginFailure, 
//   loginReset,  // ← Make sure this is exported
//   logout,      // ← Also export logout as an alternative
//   resetLoginState 
// } = loginSlice.actions;

// export default loginSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

// Use consistent keys - match what's actually in localStorage
const TOKEN_KEY = "token"; // Changed from "shophub_token" to "token"
const USER_KEY = "user"; // Changed from "shophub_user" to "user" (or keep as is if that's what you use)

const savedUser = JSON.parse(localStorage.getItem(USER_KEY)) ?? null;
const savedToken = localStorage.getItem(TOKEN_KEY) ?? null;

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    error: null,
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedUser && !!savedToken,
  },
  reducers: {
    loginStart(state) { 
      state.loading = true; 
      state.error = null; 
    },
    loginSuccess(state, { payload }) {
      state.loading = false;
      state.user = payload.user || payload;
      state.token = payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      if (payload.token) {
        localStorage.setItem(TOKEN_KEY, payload.token);
      }
    },
    loginFailure(state, { payload }) { 
      state.loading = false; 
      state.error = payload; 
      state.isAuthenticated = false;
    },
    loginReset(state) {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  loginReset 
} = loginSlice.actions;

export default loginSlice.reducer;