// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCartAsync,
  updateQuantityAsync,
  removeItemAsync,
} from "../reducers/thunks/cartThunks";

const initialState = {
  items: [],          // flattened items: { productId, name, variant, image, price, originalPrice, quantity }
  loading: false,
  error: null,
};

// Helper: transform server cart (nested product) → flat UI items
const transformCartItems = (serverCart) => {
  if (!serverCart?.items) return [];
  return serverCart.items.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    variant: item.product.brand || "Default",
    image: item.product.images?.[0] || "https://placehold.co/90x120",
    price: item.product.price,
    originalPrice: item.product.originalPrice || item.product.price,
    quantity: item.quantity,
  }));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // No coupon reducers – removed as requested
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = transformCartItems(action.payload); // action.payload = data.cart from API
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = transformCartItems(action.payload);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = transformCartItems(action.payload);
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove item
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        state.items = transformCartItems(action.payload);
      })
      .addCase(removeItemAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;