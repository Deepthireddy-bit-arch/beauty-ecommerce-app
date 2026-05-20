import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";



// Helper: get auth header from localStorage token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `${API_ENDPOINTS.wishlist}`,
        authHeader()
      );

      return data.wishlist.items;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to fetch wishlist"
      );
    }
  }
);

// ADD to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `${API_ENDPOINTS.wishlist}`,
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
      const { data } = await api.delete(
        `${API_ENDPOINTS.wishlist}/${productId}`,
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