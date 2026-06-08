import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  insiderBuzz: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
    setInsiderBuzz: (state, action) => {
      state.insiderBuzz = action.payload;
    },
  },
});

export const {
  setLoading,
  setCategories,
  setError,
  setInsiderBuzz,
} = homeSlice.actions;

export default homeSlice.reducer;