// store/slices/profileSlice.js - Debug version with logging
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ── Thunks ───────────────────────────────────────────────────────────────── */
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getState().login.token;
      
      // Debug: Log token
      console.log('🔑 Auth Token:', token);
      
      if (!token) {
        console.error('❌ No auth token found!');
        return rejectWithValue('Authentication required. Please login.');
      }

      const { data } = await axios.get(`/api/user/profile`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Add timeout to prevent hanging
        timeout: 10000,
      });

      console.log('✅ Profile data received:', data);
      return data.user || data; // Handle different API response structures
    } catch (err) {
      console.error('❌ Fetch profile error:', err.response || err.message);
      
      // Better error handling
      if (err.response?.status === 401) {
        return rejectWithValue('Session expired. Please login again.');
      }
      
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message || 
        'Failed to load profile'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      // const token = state.auth?.token;
      const token = getState().login.token;
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const { data } = await axios.put(`/api/user/profile/update`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000,
      });
      
      console.log('✅ Profile updated:', data);
      return data.user || data;
    } catch (err) {
      console.error('❌ Update profile error:', err.response || err.message);
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message || 
        'Failed to update profile'
      );
    }
  }
);

/* ── Slice ────────────────────────────────────────────────────────────────── */
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    fetchLoading: false,
    saveLoading: false,
    fetchError: null,
    saveError: null,
    initialized: false,
  },
  reducers: {
    clearProfileErrors(state) {
      state.fetchError = null;
      state.saveError = null;
    },
    clearProfile(state) {
      state.user = null;
      state.fetchLoading = false;
      state.saveLoading = false;
      state.fetchError = null;
      state.saveError = null;
      state.initialized = false;
    },
    setProfileUser(state, action) {
      state.user = action.payload;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    /* fetch */
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
        console.log('⏳ Fetching profile...');
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.user = payload;
        state.initialized = true;
        console.log('✅ Profile loaded successfully:', payload);
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.fetchLoading = false;
        state.fetchError = payload;
        state.initialized = true;
        console.error('❌ Profile fetch failed:', payload);
      });

    /* update */
    builder
      .addCase(updateProfile.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.saveLoading = false;
        state.user = payload;
        console.log('✅ Profile updated successfully:', payload);
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.saveLoading = false;
        state.saveError = payload;
        console.error('❌ Profile update failed:', payload);
      });
  },
});

export const { clearProfileErrors, clearProfile, setProfileUser } = profileSlice.actions;
export default profileSlice.reducer;