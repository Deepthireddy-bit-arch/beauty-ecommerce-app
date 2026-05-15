import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },

  reducers: {
    toggleWishlist(state, { payload }) {
      const index = state.items.findIndex(
        (i) => i.id === payload.id
      );

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(payload);
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;