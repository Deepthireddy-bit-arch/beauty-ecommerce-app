import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";

export const fetchBestSellers = createAsyncThunk(
  'bestSellers/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_ENDPOINTS.bestSellers, {
        params: { sortBy: 'bestSeller', limit: 20 }
      });
      return res.data.data || res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch best sellers'
      );
    }
  }
);

const bestSellersSlice = createSlice({
  name: "bestSellers",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ not action.error.message
      });
  },
});

export const bestSellersReducer = bestSellersSlice.reducer; 