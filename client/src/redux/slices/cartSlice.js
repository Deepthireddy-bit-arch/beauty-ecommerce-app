import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
  },

  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find(
        (i) => i.id === payload.id
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...payload, qty: 1 });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
    },

    removeFromCart(state, { payload }) {
      state.items = state.items.filter(
        (i) => i.id !== payload
      );

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;