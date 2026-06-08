import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategoryBannersApi } from "../../../api/homeApi";


export const fetchCategoryBanners = createAsyncThunk(
  "categoryBanners/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCategoryBannersApi();
      return res.data.data; // IMPORTANT (your backend returns "data")
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category banners"
      );
    }
  }
);