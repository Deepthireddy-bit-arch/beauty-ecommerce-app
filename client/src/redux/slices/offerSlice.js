import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";



export const fetchActiveOffer = createAsyncThunk(
  "offer/fetchActiveOffer",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_ENDPOINTS.getActiveOfferApi);
      return res.data.offer;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch offer"
      );
    }
  }
);

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offer: null,
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offer = action.payload;
      })
      .addCase(fetchActiveOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default offerSlice.reducer;