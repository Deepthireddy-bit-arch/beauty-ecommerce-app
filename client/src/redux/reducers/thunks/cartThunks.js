// cartThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';
import api from "../../../api/axios";
import { API_ENDPOINTS } from "../../../api/endpoints";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get(API_ENDPOINTS.cart, authHeader());
    return data.cart;
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to load cart";
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(API_ENDPOINTS.cart, { productId, quantity }, authHeader());
      // toast.success("Item added to cart");
      return data.cart;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add item";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(API_ENDPOINTS.cart, { productId, quantity }, authHeader());
      toast.success("Quantity updated");
      return data.cart;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update quantity";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const removeItemAsync = createAsyncThunk(
  "cart/removeItem",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`${API_ENDPOINTS.cart}/${productId}`, authHeader());
      toast.success("Item removed from cart");
      return data.cart;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove item";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);
export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`${API_ENDPOINTS.cart}/clear`, authHeader());
      return data.cart;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to clear cart";
      return rejectWithValue(msg);
    }
  }
);