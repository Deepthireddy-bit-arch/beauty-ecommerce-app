// ─── profileReducer.js ────────────────────────────────────────────────────────

export const initialState = {
  user: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// ── Action Types ──────────────────────────────────────────────────────────────
export const PROFILE_ACTIONS = {
  FETCH_REQUEST:   "profile/FETCH_REQUEST",
  FETCH_SUCCESS:   "profile/FETCH_SUCCESS",
  FETCH_FAILURE:   "profile/FETCH_FAILURE",
  UPDATE_REQUEST:  "profile/UPDATE_REQUEST",
  UPDATE_SUCCESS:  "profile/UPDATE_SUCCESS",
  UPDATE_FAILURE:  "profile/UPDATE_FAILURE",
  CLEAR_STATUS:    "profile/CLEAR_STATUS",
};

// ── Reducer ───────────────────────────────────────────────────────────────────
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case PROFILE_ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case PROFILE_ACTIONS.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case PROFILE_ACTIONS.UPDATE_REQUEST:
      return { ...state, loading: true, error: null, updateSuccess: false };

    case PROFILE_ACTIONS.UPDATE_SUCCESS:
      return { ...state, loading: false, user: action.payload, updateSuccess: true };

    case PROFILE_ACTIONS.UPDATE_FAILURE:
      return { ...state, loading: false, error: action.payload, updateSuccess: false };

    case PROFILE_ACTIONS.CLEAR_STATUS:
      return { ...state, error: null, updateSuccess: false };

    default:
      return state;
  }
};

export default profileReducer;