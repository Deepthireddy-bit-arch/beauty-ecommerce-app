// src/redux/thunks/loginThunk.js

import { loginApi } from "../../../api/authApi";
import { loginFailure, loginStart, loginSuccess } from "../../slices/loginSlice";

// export const loginUser = (email, password) => async (dispatch) => {
//   try {
//     dispatch(loginStart());
//     const response = await loginApi({ email, password });
//    dispatch(loginSuccess(response.data.user));
//   } catch (error) {
//     dispatch(loginFailure(error.response.data.message));
//   }
// };
// export const loginUser = (email, password) => async (dispatch) => {
//   try {
//     dispatch(loginStart());
//     const response = await loginApi({ email, password });
    
//     // Assuming response.data contains token and user
//     const { token, user } = response.data;
    
//     // ✅ Store token in localStorage
//     localStorage.setItem("token", token);
    
//     dispatch(loginSuccess(user));
//   } catch (error) {
//     dispatch(loginFailure(error.response?.data?.message || "Login failed"));
//   }
// };
export const loginUser = (email, password) => async (dispatch) => {
  console.log("LOGIN THUNK CALLED"); // 👈 add this

  try {
    dispatch(loginStart());

    const response = await loginApi({ email, password });

    console.log("API RESPONSE:", response); // 👈 add this

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    dispatch(loginSuccess(user));
  } catch (error) {
    console.log("LOGIN ERROR:", error); // 👈 add this
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  }
};