// src/redux/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../reducers/thunks/wishlistActions';

const initialState = {
  items: [],
  loading: false,
  error: null,
  isInitialized: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    updateWishlist: (state, action) => {
      state.items = action.payload || [];
    },
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.isInitialized = false;
    },
    resetWishlistError: (state) => {
      state.error = null;
    },
    // ✅ ADD THIS - clearMessages alias for resetWishlistError
    clearMessages: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchWishlist.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload ?? [];  // already unwrapped to items[]
  state.isInitialized = true;
  state.error = null;
})
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        // Check if it's a skip (not authenticated)
        if (action.payload?.skip) {
          state.isInitialized = true;
          state.error = null;
          return;
        }
        state.error = action.payload || action.error?.message || 'Failed to fetch wishlist';
        state.isInitialized = true;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(addToWishlist.fulfilled, (state, action) => {
      //   state.loading = false;
      //   if (action.payload) {
      //     // Avoid duplicates
      //     const exists = state.items.some(item => 
      //       item._id === action.payload._id || 
      //       item.productId === action.payload.productId ||
      //       item.product?._id === action.payload.productId
      //     );
      //     if (!exists) {
      //       state.items.push(action.payload);
      //     }
      //   }
      //   state.error = null;
      // })
 .addCase(addToWishlist.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  // null means "already existed, fetchWishlist handled it"
  if (action.payload !== null) {
    state.items = action.payload ?? [];
  }
})
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        // Don't show error for duplicates
        if (action.payload?.includes?.('already') || action.error?.message?.includes?.('already')) {
          return;
        }
        state.error = action.payload || action.error?.message || 'Failed to add to wishlist';
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(removeFromWishlist.fulfilled, (state) => {
      //   state.loading = false;
      //   state.error = null;
      //   // The updateWishlist reducer already handles the removal
      // })
  .addCase(removeFromWishlist.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.items = action.payload ?? [];  // updated items array from backend
})
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to remove from wishlist';
      });
  },
});

// ✅ Export both clearMessages and resetWishlistError (they do the same thing)
export const { 
  updateWishlist, 
  clearWishlist, 
  resetWishlistError,
  clearMessages  // ✅ ADD THIS EXPORT
} = wishlistSlice.actions;

export default wishlistSlice.reducer;