// src/redux/thunks/brandThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBrandsApi } from "../../../api/brandsApi";


export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBrandsApi();

      // backend response:
      // { success: true, data: [...] }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);