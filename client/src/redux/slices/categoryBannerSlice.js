import { createSlice } from "@reduxjs/toolkit";
import { fetchCategoryBanners } from "../reducers/thunks/categoryBannersThunks";


const initialState = {
  banners: [],
  loading: false,
  error: null
};

const categoryBannerSlice = createSlice({
  name: "categoryBanners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchCategoryBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default categoryBannerSlice.reducer;