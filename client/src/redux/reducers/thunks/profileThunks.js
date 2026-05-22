// ─── profileActions.js ────────────────────────────────────────────────────────
import { PROFILE_ACTIONS } from "./profileReducer";
import { fetchProfileApi, updateProfileApi } from "../api/profileApi";

// ── Fetch logged-in user's profile ────────────────────────────────────────────
export const fetchProfile = () => async (dispatch) => {
  dispatch({ type: PROFILE_ACTIONS.FETCH_REQUEST });
  try {
    const user = await fetchProfileApi();
    dispatch({ type: PROFILE_ACTIONS.FETCH_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: PROFILE_ACTIONS.FETCH_FAILURE, payload: error.message });
  }
};

// ── Update name + email ───────────────────────────────────────────────────────
export const updateProfile = (formData) => async (dispatch) => {
  dispatch({ type: PROFILE_ACTIONS.UPDATE_REQUEST });
  try {
    const updatedUser = await updateProfileApi(formData);
    dispatch({ type: PROFILE_ACTIONS.UPDATE_SUCCESS, payload: updatedUser });
  } catch (error) {
    dispatch({ type: PROFILE_ACTIONS.UPDATE_FAILURE, payload: error.message });
  }
};

// ── Clear success / error banners ─────────────────────────────────────────────
export const clearStatus = () => ({ type: PROFILE_ACTIONS.CLEAR_STATUS });