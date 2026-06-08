import { createSlice } from "@reduxjs/toolkit";
import { fetchDeals } from "../reducers/thunks/dealsThunks";


const dealsSlice = createSlice({
  name: "deals",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dealsSlice.reducer;