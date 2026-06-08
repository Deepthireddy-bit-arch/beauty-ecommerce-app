import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios";

// ─── THUNK ───────────────────────────────────────────────────────────────────
export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.collections);

      return response.data.data; // 👈 based on your backend { success, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────
const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    items: [],
    status: "idle",   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: "all",
    liked: {},        // { [_id]: boolean }
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    toggleLike: (state, action) => {
      const id = action.payload;
      state.liked[id] = !state.liked[id];
    },
    resetCollections: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilter, toggleLike, resetCollections } = collectionsSlice.actions;

// ─── SELECTORS ───────────────────────────────────────────────────────────────
export const selectAllCollections = (state) => state.collections.items;
export const selectStatus         = (state) => state.collections.status;
export const selectError          = (state) => state.collections.error;
export const selectFilter         = (state) => state.collections.filter;
export const selectLiked          = (state) => state.collections.liked;

export const selectFilteredCollections = (state) => {
  const { items, filter } = state.collections;
  return filter === "all" ? items : items.filter((i) => i.category === filter);
};

export default collectionsSlice.reducer;