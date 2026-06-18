// src/redux/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../reducers/thunks/wishlistActions';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  message: null, // Add this for messages
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.message = null;
    },
    updateWishlist: (state, action) => {
      state.items = action.payload;
      console.log("🔄 Wishlist updated manually:", state.items.length, "items");
    },
    // Add this - clearMessages reducer
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
    },
    // Add this - set message
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    // Add this - set error
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        console.log("🔄 Fetching wishlist...");
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
        console.log("✅ Wishlist refreshed:", state.items.length, "items");
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log("❌ Wishlist fetch failed:", action.payload);
      })
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
        console.log("🔄 Adding to wishlist...");
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.message = 'Item added to wishlist';
        console.log("✅ Added to wishlist");
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
        console.log("❌ Add to wishlist failed:", action.payload);
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
        console.log("🔄 Removing from wishlist...");
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.message = 'Item removed from wishlist';
        console.log("✅ Removed from wishlist - state updated via updateWishlist");
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
        console.log("❌ Remove from wishlist failed:", action.payload);
      });
  },
});

export const { 
  clearWishlist, 
  updateWishlist, 
  clearMessages,  // Make sure this is exported
  setMessage,
  setError 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;