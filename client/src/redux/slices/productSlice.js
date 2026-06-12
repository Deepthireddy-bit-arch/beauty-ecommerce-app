import { createSlice } from '@reduxjs/toolkit';
import { fetchFeaturedProducts, fetchProductById, fetchProducts } from '../reducers/thunks/productThunks';


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
    selectedBrands: [],   // ← must be array, not ''
    selectedDiscounts: [],   // ← must be array, not ''
    categories: [],
    featuredItems: [],
    featuredLoading: false,
    featuredError: null,
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
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.loading = false;

      // ✅ Derive and store unique categories
      const cats = [...new Set(action.payload.products.map(p => p.category).filter(Boolean))];
      state.categories = cats;
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
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredItems = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
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