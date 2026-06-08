import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../../api/endpoints";
import api from "../../../api/axios";


// Fetch deals
// export const fetchDeals = createAsyncThunk(
//   "deals/fetchDeals",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(API_ENDPOINTS.deals);
//       return res.data.deals;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch deals"
//       );
//     }
//   }
// );


export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_ENDPOINTS.deals);
      return res.data.deals;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deals"
      );
    }
  }
);