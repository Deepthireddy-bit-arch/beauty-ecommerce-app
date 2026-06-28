// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // ─── THUNKS ──────────────────────────────────────────────────────────────────

// export const fetchCollections = createAsyncThunk(
//   "collections/fetchAll",
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();

//       // Categories
//       if (filters.categories?.length) {
//         params.set("categories", filters.categories.join(","));
//       }

//       // Sort
//       if (filters.sortBy) {
//         params.set("sortBy", filters.sortBy);
//       }

//       // Price range — parse "500-1000" string into minPrice / maxPrice
//       if (filters.priceRange) {
//         const [min, max] = filters.priceRange.split("-").map(Number);
//         if (!isNaN(min)) params.set("minPrice", min);
//         // Infinity serialises as "Infinity" in the URL, skip it so backend gets no upper bound
//         if (!isNaN(max) && isFinite(max)) params.set("maxPrice", max);
//       }

//       // Minimum rating
//       if (filters.minRating) {
//         params.set("minRating", filters.minRating);
//       }

//       // Availability
//       if (filters.inStockOnly) {
//         params.set("inStock", "true");
//       }
//       if (filters.onSaleOnly) {
//         params.set("onSale", "true");
//       }

//       const { data } = await axios.get(
//         `${BASE}/collections?${params.toString()}`
//       );

//       return data.collections || [];
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// export const fetchCollectionById = createAsyncThunk(
//   "collections/fetchById",
//   async (
//     {
//       id,
//       category = "all",
//       sortBy = "featured",
//       page = 1,
//       minPrice,
//       maxPrice,
//     } = {},
//     { rejectWithValue }
//   ) => {
//     try {
//       const params = new URLSearchParams();

//       if (category && category !== "all") {
//         params.set("category", category);
//       }

//       if (sortBy) {
//         params.set("sortBy", sortBy);
//       }

//       if (page) {
//         params.set("page", page);
//       }

//       if (minPrice) {
//         params.set("minPrice", minPrice);
//       }

//       if (maxPrice) {
//         params.set("maxPrice", maxPrice);
//       }

//       const { data } = await axios.get(
//         `${BASE}/collections/${id}?${params.toString()}`
//       );

//       return data; // { collection, products, pagination }
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// const normalizeProducts = (products = []) =>
//   products.map((p) => ({
//     ...p,
//     image: p.images?.[0] || "",
//     mrp: p.originalPrice || p.price,
//     discount: p.discount || 0,
//     bestseller: p.isBestseller || false,
//     reviews: p.reviews || 0,
//     shades: p.shades || 1,
//     tag: p.tag || "",
//   }));

// // ─── SLICE ───────────────────────────────────────────────────────────────────

// const collectionsSlice = createSlice({
//   name: "collections",

//   initialState: {
//     collections: [],
//     allCollections: [],

//     collectionsStatus: "idle",

//     collection: null,
//     collectionStatus: "idle",

//     products: [],
//     productsStatus: "idle",

//     pagination: {},

//     filters: {
//       category: "all",
//       sortBy: "featured",
//       page: 1,
//     },

//     wishlist: {},
//     error: null,
//   },

//   reducers: {
//     setAllCollections: (state, { payload }) => {
//       state.allCollections = payload;
//       state.collections = payload;
//       state.collectionsStatus = "succeeded";
//     },

//     setSortBy: (state, { payload }) => {
//       state.filters.sortBy = payload;
//       state.filters.page = 1;
//     },

//     setPage: (state, { payload }) => {
//       state.filters.page = payload;
//     },

//     setCategory: (state, { payload }) => {
//       state.filters.category = payload;
//       state.filters.page = 1;
//     },

//     clearFilters: (state) => {
//       state.filters = {
//         category: "all",
//         sortBy: "featured",
//         page: 1,
//       };
//     },

//     clearCollection: (state) => {
//       state.collection = null;
//       state.collectionStatus = "idle";
//       state.products = [];
//       state.productsStatus = "idle";
//       state.pagination = {};
//     },

//     toggleWishlist: (state, { payload }) => {
//       state.wishlist[payload] = !state.wishlist[payload];
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // All collections
//       .addCase(fetchCollections.pending, (state) => {
//         state.collectionsStatus = "loading";
//       })
//       .addCase(fetchCollections.fulfilled, (state, action) => {
//         state.collectionsStatus = "succeeded";
//         state.collections = action.payload;
//         state.allCollections = action.payload;
//       })
//       .addCase(fetchCollections.rejected, (state, action) => {
//         state.collectionsStatus = "failed";
//         state.error = action.payload;
//       })

//       // Single collection + products
//       .addCase(fetchCollectionById.pending, (state) => {
//         state.collectionStatus = "loading";
//         state.productsStatus = "loading";
//       })
//       .addCase(fetchCollectionById.fulfilled, (state, action) => {
//         state.collectionStatus = "succeeded";
//         state.productsStatus = "succeeded";

//         state.collection = action.payload.collection;
//         state.products = normalizeProducts(action.payload.products);
//         state.pagination = action.payload.pagination || {};
//       })
//       .addCase(fetchCollectionById.rejected, (state, action) => {
//         state.collectionStatus = "failed";
//         state.productsStatus = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// // ─── ACTIONS ─────────────────────────────────────────────────────────────────

// export const {
//   setAllCollections,
//   setSortBy,
//   setPage,
//   setCategory,
//   clearFilters,
//   clearCollection,
//   toggleWishlist,
// } = collectionsSlice.actions;

// // ─── SELECTORS ───────────────────────────────────────────────────────────────

// export const selectCollections = (state) => state.collections.collections;
// export const selectCollectionsStatus = (state) =>
//   state.collections.collectionsStatus;
// export const selectAllCollections = (state) =>
//   state.collections.allCollections;

// export const selectCollection = (state) => state.collections.collection;
// export const selectCollectionStatus = (state) =>
//   state.collections.collectionStatus;

// export const selectProducts = (state) => state.collections.products;
// export const selectProductsStatus = (state) =>
//   state.collections.productsStatus;

// export const selectPagination = (state) => state.collections.pagination;
// export const selectFilters = (state) => state.collections.filters;
// export const selectWishlist = (state) => state.collections.wishlist;
// export const selectError = (state) => state.collections.error;

// // ─── EXPORT REDUCER ──────────────────────────────────────────────────────────

// export default collectionsSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import { fetchWishlist } from "../reducers/thunks/wishlistActions";

// ─── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.categories?.length) {
        params.set("categories", filters.categories.join(","));
      }

      if (filters.sortBy) {
        params.set("sortBy", filters.sortBy);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (!isNaN(min)) params.set("minPrice", min);
        if (!isNaN(max) && isFinite(max)) params.set("maxPrice", max);
      }

      if (filters.minRating) {
        params.set("minRating", filters.minRating);
      }

      if (filters.inStockOnly) {
        params.set("inStock", "true");
      }
      if (filters.onSaleOnly) {
        params.set("onSale", "true");
      }

      const { data } = await api.get(
        `${API_ENDPOINTS.collections}?${params.toString()}`
      );

      return data.collections || [];
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ─── FETCH CATEGORIES ────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk(
  "collections/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(API_ENDPOINTS.categoryGet);
      
      const categoriesArray = data.categories || [];
      
      const formattedCategories = categoriesArray.map((category) => ({
        _id: category.toLowerCase(),
        name: category,
        label: category,
        value: category.toLowerCase(),
        icon: getCategoryIcon(category),
        count: 0,
      }));
      
      return formattedCategories;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// Helper function for category icons
const getCategoryIcon = (category) => {
  const icons = {
    'makeup': '💋',
    'skincare': '✨',
    'haircare': '💆',
    'fragrance': '🌸',
    'nail': '💅',
    'tools': '🛠️',
    'accessories': '👝',
  };
  return icons[category.toLowerCase()] || '📂';
};

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

      const { data } = await api.get(
        `${API_ENDPOINTS.collections}/${id}?${params.toString()}`
      );

      return data;
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
    categories: [],
    categoriesStatus: "idle",

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
    wishlistItems: [],
    wishlistStatus: "idle",
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

    setWishlistItems: (state, { payload }) => {
      state.wishlistItems = payload || [];
      state.wishlist = {};
      payload.forEach(item => {
        const productId = item.product?._id || item.productId || item._id;
        if (productId) {
          state.wishlist[productId] = true;
        }
      });
    },

    toggleWishlist: (state, { payload }) => {
      const productId = payload;
      const isCurrentlyLiked = state.wishlist[productId] || false;
      state.wishlist[productId] = !isCurrentlyLiked;
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

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
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
      })

      // Wishlist sync
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        const items = action.payload || [];
        state.wishlistItems = items;
        state.wishlist = {};
        items.forEach(item => {
          const productId = item.product?._id || item.productId || item._id;
          if (productId) {
            state.wishlist[productId] = true;
          }
        });
        state.wishlistStatus = "succeeded";
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        if (action.payload?.skip) {
          state.wishlistStatus = "skipped";
          return;
        }
        state.wishlistStatus = "failed";
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
  setWishlistItems,
  toggleWishlist,
} = collectionsSlice.actions;

// ─── SELECTORS ───────────────────────────────────────────────────────────────

export const selectCollections = (state) => state.collections.collections;
export const selectCollectionsStatus = (state) =>
  state.collections.collectionsStatus;
export const selectAllCollections = (state) =>
  state.collections.allCollections;

export const selectCategories = (state) => state.collections.categories;
export const selectCategoriesStatus = (state) => state.collections.categoriesStatus;

export const selectCollection = (state) => state.collections.collection;
export const selectCollectionStatus = (state) =>
  state.collections.collectionStatus;

export const selectProducts = (state) => state.collections.products;
export const selectProductsStatus = (state) =>
  state.collections.productsStatus;

export const selectPagination = (state) => state.collections.pagination;
export const selectFilters = (state) => state.collections.filters;
export const selectWishlist = (state) => state.collections.wishlist;
export const selectWishlistItems = (state) => state.collections.wishlistItems;
export const selectWishlistStatus = (state) => state.collections.wishlistStatus;
export const selectError = (state) => state.collections.error;

// ─── EXPORT REDUCER ──────────────────────────────────────────────────────────

export default collectionsSlice.reducer;