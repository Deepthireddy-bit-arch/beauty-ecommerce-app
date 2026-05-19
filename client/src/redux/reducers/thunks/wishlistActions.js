import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "/api/wishlist";

// Helper: get auth header from localStorage token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// // GET wishlist
// export const fetchWishlist = createAsyncThunk(
//   "wishlist/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(BASE_URL, authHeader());
//       return data.wishlist;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch wishlist"
//       );
//     }
//   }
// );
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}`,
        authHeader()
      );

      return data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// ADD to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        BASE_URL,
        { productId },
        authHeader()
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item"
      );
    }
  }
);

// REMOVE from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/${productId}`,
        authHeader()
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);