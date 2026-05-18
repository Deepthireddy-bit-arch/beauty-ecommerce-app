import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'default',
  },
  reducers: { //update the satte based on user interactions
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setCategory, setSortBy } = productSlice.actions;

export const selectFilteredProducts = (state) => {
  let products = [...state.products.items];
  const { searchQuery, selectedCategory, sortBy } = state.products;

  if (selectedCategory !== 'All') {
    products = products.filter((p) => p.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name_asc') products.sort((a, b) => a.name.localeCompare(b.name));

  return products;
};

export const selectCategories = (state) => {
  const cats = [...new Set(state.products.items.map((p) => p.category))];
  return ['All', ...cats];
};

export default productSlice.reducer;