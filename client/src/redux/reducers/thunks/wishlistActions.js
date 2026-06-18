// src/redux/reducers/thunks/wishlistActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

import { updateWishlist } from '../../slices/wishlistSlice';
import api from '../../../api/axios';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      console.log("📦 Wishlist API response:", response.data);
      
      const wishlistItems = response.data?.wishlist?.items || [];
      console.log("📦 Extracted wishlist items:", wishlistItems);
      
      return wishlistItems;
    } catch (error) {
      console.log("❌ Wishlist fetch error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/wishlist/add', { productId });
      console.log("✅ Added to wishlist:", response.data);
      
      // Refetch wishlist to get updated list
      await dispatch(fetchWishlist());
      
      return response.data;
    } catch (error) {
      console.log("❌ Add to wishlist error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log(`🔍 Removing product ID: ${productId}`);
      
      // Make the API call
      const response = await api.delete(`/wishlist/${productId}`);
      
      console.log("✅ Removed from wishlist:", response.data);
      
      // Immediately update local state to reflect removal
      const state = getState();
      const currentItems = state.wishlist?.items || [];
      const updatedItems = currentItems.filter(
        item => item.product?._id !== productId && item.productId !== productId
      );
      
      // Update the wishlist in Redux immediately
      dispatch(updateWishlist(updatedItems));
      
      return response.data;
    } catch (error) {
      console.log("❌ Remove from wishlist error:", error);
      console.log("❌ Error response:", error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);