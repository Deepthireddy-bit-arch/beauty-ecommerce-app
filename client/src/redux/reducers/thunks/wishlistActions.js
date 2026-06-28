// // // src/redux/reducers/thunks/wishlistActions.js
// // import { createAsyncThunk } from '@reduxjs/toolkit';
// // import { updateWishlist } from '../../slices/wishlistSlice';
// // import api from '../../../api/axios';

// // // ✅ Fixed: Use createAsyncThunk for consistency
// // export const fetchWishlist = createAsyncThunk(
// //   'wishlist/fetch',
// //   async (_, { getState, rejectWithValue }) => {
// //     const { auth } = getState();
    
// //     // Skip if not authenticated
// //     if (!auth?.isAuthenticated || !auth?.token) {
// //       console.log("⏭️ Skipping wishlist fetch - not authenticated");
// //       return rejectWithValue({ skip: true, message: 'Not authenticated' });
// //     }

// //     try {
// //       const response = await api.get('/wishlist');
// //       console.log("✅ Wishlist fetched:", response.data);
// //       return response.data;
// //     } catch (error) {
// //       // Handle 401 gracefully
// //       if (error.response?.status === 401) {
// //         console.debug("⏭️ Wishlist not available (unauthorized)");
// //         return rejectWithValue({ skip: true, reason: 'unauthorized' });
// //       }
// //       return rejectWithValue(error.response?.data || error.message);
// //     }
// //   }
// // );

// // export const addToWishlist = createAsyncThunk(
// //   'wishlist/add',
// //   async (productId, { rejectWithValue, dispatch }) => {
// //     try {
// //       const response = await api.post('/wishlist/add', { productId });
// //       console.log("✅ Added to wishlist:", response.data);
      
// //       // Refetch wishlist to get updated list
// //       await dispatch(fetchWishlist());
      
// //       return response.data;
// //     } catch (error) {
// //       console.log("❌ Add to wishlist error:", error);
// //       return rejectWithValue(error.response?.data || error.message);
// //     }
// //   }
// // );

// // export const removeFromWishlist = createAsyncThunk(
// //   'wishlist/remove',
// //   async (productId, { rejectWithValue, dispatch, getState }) => {
// //     try {
// //       console.log(`🔍 Removing product ID: ${productId}`);
      
// //       const response = await api.delete(`/wishlist/${productId}`);
// //       console.log("✅ Removed from wishlist:", response.data);
      
// //       // Immediately update local state to reflect removal
// //       const state = getState();
// //       const currentItems = state.wishlist?.items || [];
// //       const updatedItems = currentItems.filter(
// //         item => item.product?._id !== productId && item.productId !== productId
// //       );
      
// //       dispatch(updateWishlist(updatedItems));
      
// //       return response.data;
// //     } catch (error) {
// //       console.log("❌ Remove from wishlist error:", error);
// //       console.log("❌ Error response:", error.response?.data);
// //       return rejectWithValue(error.response?.data || error.message);
// //     }
// //   }
// // );
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../../api/axios";

// // fetchWishlist — fix: state.login not state.auth
// export const fetchWishlist = createAsyncThunk(
//   'wishlist/fetch',
//   async (_, { getState, rejectWithValue }) => {
//     const { login } = getState();

//     if (!login?.isAuthenticated || !login?.token) {
//       return rejectWithValue({ skip: true, message: 'Not authenticated' });
//     }

//     try {
//       const response = await api.get('/wishlist');
//       // unwrap: API returns { wishlist: [...] } or { items: [...] } or bare array
//       return response.data?.wishlist
//         ?? response.data?.items
//         ?? response.data
//         ?? [];
//     } catch (error) {
//       if (error.response?.status === 401) {
//         return rejectWithValue({ skip: true, reason: 'unauthorized' });
//       }
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // addToWishlist — after adding, refetch so items array is always server-authoritative
// // export const addToWishlist = createAsyncThunk(
// //   'wishlist/add',
// //   async (productId, { rejectWithValue, dispatch }) => {
// //     try {
// //       await api.post('/wishlist/add', { productId });
// //       const result = await dispatch(fetchWishlist());
// //       return result.payload || { productId };
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data || error.message);
// //     }
// //   }
// // );
// export const addToWishlist = createAsyncThunk(
//   'wishlist/add',
//   async (productId, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.post('/wishlist/add', { productId });
      
//       // ✅ API returns { success: false, message: "Product already in wishlist" }
//       // Treat this as a soft success — item IS in wishlist, just fetch to sync
//       if (!response.data?.success && 
//           response.data?.message?.toLowerCase().includes('already')) {
//         await dispatch(fetchWishlist());
//         return { productId, alreadyExists: true };
//       }
      
//       await dispatch(fetchWishlist());
//       return { productId };
//     } catch (error) {
//       // Only real errors (network, 500, etc.) reach here
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // removeFromWishlist — same, refetch after delete for consistency
// export const removeFromWishlist = createAsyncThunk(
//   'wishlist/remove',
//   async (productId, { rejectWithValue, dispatch }) => {
//     try {
//       await api.delete(`/wishlist/${productId}`);
//       const result = await dispatch(fetchWishlist());
//       return result.payload || { productId };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

// ─── FETCH ────────────────────────────────────────────────────────────────────
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    const { login } = getState();
    if (!login?.isAuthenticated || !login?.token) {
      return rejectWithValue({ skip: true });
    }
    try {
      const { data } = await api.get("/wishlist");
      // ✅ backend returns { success, wishlist: { items: [{ product: {...} }] } }
      return data.wishlist?.items ?? [];
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue({ skip: true });
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ─── ADD ──────────────────────────────────────────────────────────────────────
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.post("/wishlist/add", { productId });
      // ✅ success: backend returns updated wishlist directly
      // Set items immediately from response — no need for extra fetchWishlist
      return data.wishlist?.items ?? [];
    } catch (error) {
      // ✅ 400 = "already in wishlist" — treat as soft success, just refetch
      if (error.response?.status === 400 &&
          error.response?.data?.message?.toLowerCase().includes("already")) {
        await dispatch(fetchWishlist());
        return null; // signal: already existed, items updated via fetchWishlist
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ─── REMOVE ───────────────────────────────────────────────────────────────────
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      // ✅ backend returns updated wishlist directly
      return data.wishlist?.items ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);