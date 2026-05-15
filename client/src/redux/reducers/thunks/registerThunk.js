

import { registerApi } from "../../../api/authApi";
import { registerFailure, registerStart, registerSuccess } from "../../slices/registerSlice";

export const registerUser =
  (name, email, password) => async (dispatch) => {

    dispatch(registerStart());

    try {

      const response = await registerApi({
        name,
        email,
        password,
      });

      dispatch(registerSuccess(response.data.user));

    } catch (err) {

      dispatch(
        registerFailure(
          err.response?.data?.message || "Registration failed"
        )
      );

    }
  };