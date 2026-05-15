import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",

  initialState: {
    cartOpen: false,
    activeCategory: "All",
    toast: null,
  },

  reducers: {
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },

    setCategory(state, { payload }) {
      state.activeCategory = payload;
    },

    showToast(state, { payload }) {
      state.toast = payload;
    },

    hideToast(state) {
      state.toast = null;
    },
  },
});

export const {
  toggleCart,
  setCategory,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;