import { loginApi } from "../../../api/authApi";
import { loginFailure, loginStart, loginSuccess } from "../../slices/loginSlice";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await loginApi({ email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);   // ← save token
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  }
};