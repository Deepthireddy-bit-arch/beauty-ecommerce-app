// src/redux/slices/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Thunks ── */

// export const searchProducts = createAsyncThunk(
//   "search/searchProducts",
//   async (params, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/search`, { params });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Search failed");
//     }
//   }
// );
// In searchSlice.js — inside your searchProducts thunk
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (params, { rejectWithValue }) => {
    try {
      // ✅ Remove the early-return block — always hit the API
      const response = await axios.get(`${BASE_URL}/search`, { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);
// export const fetchSuggestions = createAsyncThunk(
//   "search/fetchSuggestions",
//   async (q, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/search/suggestions`, { params: { q } });
//       return res.data.suggestions;
//     } catch {
//       return rejectWithValue([]);
//     }
//   }
// );
export const fetchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async (q, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/search/suggestions`, { params: { q } });
      const raw = res.data.suggestions || [];

      // ✅ Normalize — backend may return `name` instead of `label`
      return raw.map((s) => ({
        ...s,
        label: s.label || s.name || s.title || s.query || "",
      }));
    } catch {
      return rejectWithValue([]);
    }
  }
);
/* ── Slice ── */

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query:       "",
    products:    [],
    pagination:  { total: 0, page: 1, pages: 1, limit: 12 },
    facets:      { categories: [], brands: [] },
    filters: {
      category: "",
      brand:    "",
      minPrice: "",
      maxPrice: "",
      sort:     "relevant",
    },
    suggestions:     [],
    suggestLoading:  false,
    loading:         false,
    error:           null,
  },
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    resetFilters(state) {
      state.filters = { category: "", brand: "", minPrice: "", maxPrice: "", sort: "relevant" };
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
    clearSearch(state) {
      state.products   = [];
      state.query      = "";
      state.pagination = { total: 0, page: 1, pages: 1, limit: 12 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading    = false;
        state.products   = action.payload.products  || [];
        // state.pagination = action.payload.pagination || state.pagination;
        state.pagination = {
  total: action.payload.total ?? action.payload.products?.length ?? 0,
  pages: action.payload.pages ?? action.payload.totalPages ?? 1,
  page:  action.payload.page  ?? action.payload.currentPage ?? 1,
};
        state.facets     = action.payload.facets     || state.facets;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.suggestLoading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestLoading = false;
        state.suggestions    = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestLoading = false;
        state.suggestions    = [];
      });
  },
});

export const {
  setSearchQuery, setFilter, resetFilters,
  clearSuggestions, clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;