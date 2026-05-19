import { createSlice } from '@reduxjs/toolkit';
import { fetchProductById, fetchProducts } from '../reducers/thunks/productThunks';


const productSlice = createSlice({ //intial state of the product slice
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'default',
    page: 1,
    selectedProduct: null,
  },

  reducers: {  //update the state based on the user input
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.error = null;
    }
  },

  extraReducers: (builder) => { //handle the async thunks for fetching products and poduct details
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const {
  setSearchQuery,
  setCategory,
  setSortBy,
  setPage,
  clearSelectedProduct
} = productSlice.actions;

export default productSlice.reducer;