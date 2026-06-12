import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Categories
      if (filters.categories?.length) {
        params.set("categories", filters.categories.join(","));
      }

      // Sort
      if (filters.sortBy) {
        params.set("sortBy", filters.sortBy);
      }

      // Price range — parse "500-1000" string into minPrice / maxPrice
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (!isNaN(min)) params.set("minPrice", min);
        // Infinity serialises as "Infinity" in the URL, skip it so backend gets no upper bound
        if (!isNaN(max) && isFinite(max)) params.set("maxPrice", max);
      }

      // Minimum rating
      if (filters.minRating) {
        params.set("minRating", filters.minRating);
      }

      // Availability
      if (filters.inStockOnly) {
        params.set("inStock", "true");
      }
      if (filters.onSaleOnly) {
        params.set("onSale", "true");
      }

      const { data } = await axios.get(
        `${BASE}/collections?${params.toString()}`
      );

      return data.collections || [];
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  "collections/fetchById",
  async (
    {
      id,
      category = "all",
      sortBy = "featured",
      page = 1,
      minPrice,
      maxPrice,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (category && category !== "all") {
        params.set("category", category);
      }

      if (sortBy) {
        params.set("sortBy", sortBy);
      }

      if (page) {
        params.set("page", page);
      }

      if (minPrice) {
        params.set("minPrice", minPrice);
      }

      if (maxPrice) {
        params.set("maxPrice", maxPrice);
      }

      const { data } = await axios.get(
        `${BASE}/collections/${id}?${params.toString()}`
      );

      return data; // { collection, products, pagination }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const normalizeProducts = (products = []) =>
  products.map((p) => ({
    ...p,
    image: p.images?.[0] || "",
    mrp: p.originalPrice || p.price,
    discount: p.discount || 0,
    bestseller: p.isBestseller || false,
    reviews: p.reviews || 0,
    shades: p.shades || 1,
    tag: p.tag || "",
  }));

// ─── SLICE ───────────────────────────────────────────────────────────────────

const collectionsSlice = createSlice({
  name: "collections",

  initialState: {
    collections: [],
    allCollections: [],

    collectionsStatus: "idle",

    collection: null,
    collectionStatus: "idle",

    products: [],
    productsStatus: "idle",

    pagination: {},

    filters: {
      category: "all",
      sortBy: "featured",
      page: 1,
    },

    wishlist: {},
    error: null,
  },

  reducers: {
    setAllCollections: (state, { payload }) => {
      state.allCollections = payload;
      state.collections = payload;
      state.collectionsStatus = "succeeded";
    },

    setSortBy: (state, { payload }) => {
      state.filters.sortBy = payload;
      state.filters.page = 1;
    },

    setPage: (state, { payload }) => {
      state.filters.page = payload;
    },

    setCategory: (state, { payload }) => {
      state.filters.category = payload;
      state.filters.page = 1;
    },

    clearFilters: (state) => {
      state.filters = {
        category: "all",
        sortBy: "featured",
        page: 1,
      };
    },

    clearCollection: (state) => {
      state.collection = null;
      state.collectionStatus = "idle";
      state.products = [];
      state.productsStatus = "idle";
      state.pagination = {};
    },

    toggleWishlist: (state, { payload }) => {
      state.wishlist[payload] = !state.wishlist[payload];
    },
  },

  extraReducers: (builder) => {
    builder
      // All collections
      .addCase(fetchCollections.pending, (state) => {
        state.collectionsStatus = "loading";
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collectionsStatus = "succeeded";
        state.collections = action.payload;
        state.allCollections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.collectionsStatus = "failed";
        state.error = action.payload;
      })

      // Single collection + products
      .addCase(fetchCollectionById.pending, (state) => {
        state.collectionStatus = "loading";
        state.productsStatus = "loading";
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.collectionStatus = "succeeded";
        state.productsStatus = "succeeded";

        state.collection = action.payload.collection;
        state.products = normalizeProducts(action.payload.products);
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.collectionStatus = "failed";
        state.productsStatus = "failed";
        state.error = action.payload;
      });
  },
});

// ─── ACTIONS ─────────────────────────────────────────────────────────────────

export const {
  setAllCollections,
  setSortBy,
  setPage,
  setCategory,
  clearFilters,
  clearCollection,
  toggleWishlist,
} = collectionsSlice.actions;

// ─── SELECTORS ───────────────────────────────────────────────────────────────

export const selectCollections = (state) => state.collections.collections;
export const selectCollectionsStatus = (state) =>
  state.collections.collectionsStatus;
export const selectAllCollections = (state) =>
  state.collections.allCollections;

export const selectCollection = (state) => state.collections.collection;
export const selectCollectionStatus = (state) =>
  state.collections.collectionStatus;

export const selectProducts = (state) => state.collections.products;
export const selectProductsStatus = (state) =>
  state.collections.productsStatus;

export const selectPagination = (state) => state.collections.pagination;
export const selectFilters = (state) => state.collections.filters;
export const selectWishlist = (state) => state.collections.wishlist;
export const selectError = (state) => state.collections.error;

// ─── EXPORT REDUCER ──────────────────────────────────────────────────────────

export default collectionsSlice.reducer;