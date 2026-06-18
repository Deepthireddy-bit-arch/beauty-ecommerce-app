// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // ─── THUNKS ──────────────────────────────────────────────────────────────────

// export const fetchBrandBanners = createAsyncThunk(
//   "brands/fetchBanners",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${BASE}/banners?type=brand`);
//       return data.data;
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// export const fetchBrands = createAsyncThunk(
//   "brands/fetchBrands",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${BASE}/brands`);
//       return data.data?.brands || data.data || [];
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// // Single brand — also returns products with optional filters
// export const fetchSingleBrand = createAsyncThunk(
//   "brands/fetchSingleBrand",
//   async ({ id, category = "all", sortBy = "featured", page = 1 }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       if (category && category !== "all") params.set("category", category);
//       if (sortBy) params.set("sortBy", sortBy);
//       if (page)   params.set("page",   page);

//       const { data } = await axios.get(`${BASE}/brands/${id}?${params.toString()}`);
//       return data; // { success, brand, products, pagination }
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// // Still used for the brands listing page filters
// export const fetchBrandProducts = createAsyncThunk(
//   "brands/fetchProducts",
//   async (filters = {}, { rejectWithValue, getState }) => {
//     try {
//       const params = new URLSearchParams();

//       if (filters.brands?.length) {
//         const firstVal = filters.brands[0];
//         const areIds = /^[a-f0-9]{24}$/i.test(firstVal);
//         if (areIds) {
//           const allBrands = getState().brands.brands;
//           const brandNames = filters.brands
//             .map((id) => allBrands.find((b) => b._id === id)?.name)
//             .filter(Boolean);
//           if (brandNames.length) params.set("brands", brandNames.join(","));
//         } else {
//           params.set("brands", filters.brands.join(","));
//         }
//       }

//       if (filters.categories?.length) params.set("categories", filters.categories.join(","));
//       if (filters.priceRanges?.length) params.set("priceRanges", filters.priceRanges.join(","));
//       if (filters.discounts?.length)   params.set("discounts",   filters.discounts.join(","));
//       if (filters.sortBy) params.set("sortBy", filters.sortBy);
//       if (filters.page)   params.set("page",   filters.page);

//       const { data } = await axios.get(`${BASE}/products?${params.toString()}`);
//       return { products: data.data || data.products, pagination: data.pagination };
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || e.message);
//     }
//   }
// );

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// const normalizeProducts = (products = []) =>
//   products.map((p) => ({
//     ...p,
//     image:      p.images?.[0] || "",
//     mrp:        p.originalPrice || p.price,
//     discount:   p.discount  || 0,
//     bestseller: p.isBestseller || false,
//     reviews:    p.reviews   || 0,
//     shades:     p.shades    || 1,
//     tag:        p.tag       || "",
//   }));

// // ─── SLICE ───────────────────────────────────────────────────────────────────

// const brandsSlice = createSlice({
//   name: "brands",
//   initialState: {
//     banners: [],       bannersStatus: "idle",
//     brands:  [],       brandsStatus:  "idle",
//     products: [],      productsStatus: "idle",
//     pagination: {},
//     error: null,
//     filters: {
//       priceRanges: [], categories: [], discounts: [],
//       brands: [], sortBy: "featured", page: 1,
//     },
//     brand: null,       brandStatus: "idle",
//     activeBanner: 0,
//     wishlist: {},
//   },

//   reducers: {
//     togglePriceRange: (state, { payload }) => {
//       const i = state.filters.priceRanges.indexOf(payload);
//       i === -1 ? state.filters.priceRanges.push(payload) : state.filters.priceRanges.splice(i, 1);
//       state.filters.page = 1;
//     },
//     toggleCategory: (state, { payload }) => {
//       const i = state.filters.categories.indexOf(payload);
//       i === -1 ? state.filters.categories.push(payload) : state.filters.categories.splice(i, 1);
//       state.filters.page = 1;
//     },
//     toggleDiscount: (state, { payload }) => {
//       const i = state.filters.discounts.indexOf(payload);
//       i === -1 ? state.filters.discounts.push(payload) : state.filters.discounts.splice(i, 1);
//       state.filters.page = 1;
//     },
//     toggleBrandFilter: (state, { payload }) => {
//       const i = state.filters.brands.indexOf(payload);
//       i === -1 ? state.filters.brands.push(payload) : state.filters.brands.splice(i, 1);
//       state.filters.page = 1;
//     },
//     setSortBy: (state, { payload }) => {
//       state.filters.sortBy = payload;
//       state.filters.page = 1;
//     },
//     setPage: (state, { payload }) => { state.filters.page = payload; },
//     clearAllFilters: (state) => {
//       state.filters = {
//         priceRanges: [], categories: [], discounts: [],
//         brands: [], sortBy: "featured", page: 1,
//       };
//     },
//     clearBrand: (state) => {
//       state.brand = null;   state.brandStatus = "idle";
//       state.products = [];  state.pagination  = {};
//       state.productsStatus = "idle";
//     },
//     setActiveBanner:  (state, { payload }) => { state.activeBanner = payload; },
//     toggleWishlist:   (state, { payload }) => { state.wishlist[payload] = !state.wishlist[payload]; },
//   },

//   extraReducers: (builder) => {
//     builder
//       // Banners
//       .addCase(fetchBrandBanners.pending,   (s) => { s.bannersStatus = "loading"; })
//       .addCase(fetchBrandBanners.fulfilled, (s, a) => { s.bannersStatus = "succeeded"; s.banners = a.payload; })
//       .addCase(fetchBrandBanners.rejected,  (s) => { s.bannersStatus = "failed"; })

//       // All brands list
//       .addCase(fetchBrands.pending,   (s) => { s.brandsStatus = "loading"; })
//       .addCase(fetchBrands.fulfilled, (s, a) => { s.brandsStatus = "succeeded"; s.brands = a.payload; })
//       .addCase(fetchBrands.rejected,  (s) => { s.brandsStatus = "failed"; })

//       // Single brand + its products (one call)
//       .addCase(fetchSingleBrand.pending, (s) => {
//         s.brandStatus    = "loading";
//         s.productsStatus = "loading";
//       })
//       .addCase(fetchSingleBrand.fulfilled, (s, a) => {
//         s.brandStatus    = "succeeded";
//         s.productsStatus = "succeeded";
//         s.brand          = a.payload.brand;
//         s.products       = normalizeProducts(a.payload.products);
//         s.pagination     = a.payload.pagination || {};
//       })
//       .addCase(fetchSingleBrand.rejected, (s, a) => {
//         s.brandStatus    = "failed";
//         s.productsStatus = "failed";
//         s.error          = a.payload;
//       })

//       // Products only (brands listing page)
//       .addCase(fetchBrandProducts.pending,   (s) => { s.productsStatus = "loading"; s.error = null; })
//       .addCase(fetchBrandProducts.fulfilled, (s, a) => {
//         s.productsStatus = "succeeded";
//         s.products       = normalizeProducts(a.payload.products);
//         s.pagination     = a.payload.pagination;
//       })
//       .addCase(fetchBrandProducts.rejected,  (s, a) => {
//         s.productsStatus = "failed";
//         s.error          = a.payload;
//       });
//   },
// });

// export const {
//   togglePriceRange, toggleCategory, toggleDiscount,
//   toggleBrandFilter, setSortBy, setPage, clearAllFilters,
//   clearBrand, setActiveBanner, toggleWishlist,
// } = brandsSlice.actions;

// export const selectBanners        = (s) => s.brands.banners;
// export const selectBrands         = (s) => s.brands.brands;
// export const selectFilters        = (s) => s.brands.filters;
// export const selectWishlist       = (s) => s.brands.wishlist;
// export const selectActiveBanner   = (s) => s.brands.activeBanner;
// export const selectProductsStatus = (s) => s.brands.productsStatus;
// export const selectProducts       = (s) => s.brands.products;
// export const selectPagination     = (s) => s.brands.pagination;
// export const selectBrand          = (s) => s.brands.brand;
// export const selectBrandStatus    = (s) => s.brands.brandStatus;

// export default brandsSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchBrandBanners = createAsyncThunk(
  "brands/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/banners?type=brand`);
      return data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/brands`);
      return data.data?.brands || data.data || [];
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ─── FETCH CATEGORIES ────────────────────────────────────────────────────────
export const fetchCategories = createAsyncThunk(
  "brands/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/categories`);
      // API returns: { success: true, categories: ["Makeup", "Skincare", ...] }
      const categoriesArray = data.categories || [];
      // Format categories for the filter UI
      const formattedCategories = categoriesArray.map((category) => ({
        _id: category.toLowerCase(),
        name: category,
        label: category,
        value: category.toLowerCase(),
        icon: getCategoryIcon(category),
        count: 0, // You can add count if needed
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

// Single brand — also returns products with optional filters
export const fetchSingleBrand = createAsyncThunk(
  "brands/fetchSingleBrand",
  async ({ id, category = "all", sortBy = "featured", page = 1 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (sortBy) params.set("sortBy", sortBy);
      if (page)   params.set("page",   page);

      const { data } = await axios.get(`${BASE}/brands/${id}?${params.toString()}`);
      return data; // { success, brand, products, pagination }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// Still used for the brands listing page filters
export const fetchBrandProducts = createAsyncThunk(
  "brands/fetchProducts",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const params = new URLSearchParams();

      if (filters.brands?.length) {
        const firstVal = filters.brands[0];
        const areIds = /^[a-f0-9]{24}$/i.test(firstVal);
        if (areIds) {
          const allBrands = getState().brands.brands;
          const brandNames = filters.brands
            .map((id) => allBrands.find((b) => b._id === id)?.name)
            .filter(Boolean);
          if (brandNames.length) params.set("brands", brandNames.join(","));
        } else {
          params.set("brands", filters.brands.join(","));
        }
      }

      if (filters.categories?.length) params.set("categories", filters.categories.join(","));
      if (filters.priceRanges?.length) params.set("priceRanges", filters.priceRanges.join(","));
      if (filters.discounts?.length)   params.set("discounts",   filters.discounts.join(","));
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.page)   params.set("page",   filters.page);

      const { data } = await axios.get(`${BASE}/products?${params.toString()}`);
      return { products: data.data || data.products, pagination: data.pagination };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const normalizeProducts = (products = []) =>
  products.map((p) => ({
    ...p,
    image:      p.images?.[0] || "",
    mrp:        p.originalPrice || p.price,
    discount:   p.discount  || 0,
    bestseller: p.isBestseller || false,
    reviews:    p.reviews   || 0,
    shades:     p.shades    || 1,
    tag:        p.tag       || "",
  }));

// ─── SLICE ───────────────────────────────────────────────────────────────────

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    banners: [],       bannersStatus: "idle",
    brands:  [],       brandsStatus:  "idle",
    categories: [],    categoriesStatus: "idle", // ← Add this
    products: [],      productsStatus: "idle",
    pagination: {},
    error: null,
    filters: {
      priceRanges: [], categories: [], discounts: [],
      brands: [], sortBy: "featured", page: 1,
    },
    brand: null,       brandStatus: "idle",
    activeBanner: 0,
    wishlist: {},
  },

  reducers: {
    togglePriceRange: (state, { payload }) => {
      const i = state.filters.priceRanges.indexOf(payload);
      i === -1 ? state.filters.priceRanges.push(payload) : state.filters.priceRanges.splice(i, 1);
      state.filters.page = 1;
    },
    toggleCategory: (state, { payload }) => {
      const i = state.filters.categories.indexOf(payload);
      i === -1 ? state.filters.categories.push(payload) : state.filters.categories.splice(i, 1);
      state.filters.page = 1;
    },
    toggleDiscount: (state, { payload }) => {
      const i = state.filters.discounts.indexOf(payload);
      i === -1 ? state.filters.discounts.push(payload) : state.filters.discounts.splice(i, 1);
      state.filters.page = 1;
    },
    toggleBrandFilter: (state, { payload }) => {
      const i = state.filters.brands.indexOf(payload);
      i === -1 ? state.filters.brands.push(payload) : state.filters.brands.splice(i, 1);
      state.filters.page = 1;
    },
    setSortBy: (state, { payload }) => {
      state.filters.sortBy = payload;
      state.filters.page = 1;
    },
    setPage: (state, { payload }) => { state.filters.page = payload; },
    clearAllFilters: (state) => {
      state.filters = {
        priceRanges: [], categories: [], discounts: [],
        brands: [], sortBy: "featured", page: 1,
      };
    },
    clearBrand: (state) => {
      state.brand = null;   state.brandStatus = "idle";
      state.products = [];  state.pagination  = {};
      state.productsStatus = "idle";
    },
    setActiveBanner:  (state, { payload }) => { state.activeBanner = payload; },
    toggleWishlist:   (state, { payload }) => { state.wishlist[payload] = !state.wishlist[payload]; },
  },

  extraReducers: (builder) => {
    builder
      // Banners
      .addCase(fetchBrandBanners.pending,   (s) => { s.bannersStatus = "loading"; })
      .addCase(fetchBrandBanners.fulfilled, (s, a) => { s.bannersStatus = "succeeded"; s.banners = a.payload; })
      .addCase(fetchBrandBanners.rejected,  (s) => { s.bannersStatus = "failed"; })

      // All brands list
      .addCase(fetchBrands.pending,   (s) => { s.brandsStatus = "loading"; })
      .addCase(fetchBrands.fulfilled, (s, a) => { s.brandsStatus = "succeeded"; s.brands = a.payload; })
      .addCase(fetchBrands.rejected,  (s) => { s.brandsStatus = "failed"; })

      // Categories
      .addCase(fetchCategories.pending, (s) => { s.categoriesStatus = "loading"; })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.categoriesStatus = "succeeded";
        s.categories = a.payload;
      })
      .addCase(fetchCategories.rejected, (s) => { s.categoriesStatus = "failed"; })

      // Single brand + its products (one call)
      .addCase(fetchSingleBrand.pending, (s) => {
        s.brandStatus    = "loading";
        s.productsStatus = "loading";
      })
      .addCase(fetchSingleBrand.fulfilled, (s, a) => {
        s.brandStatus    = "succeeded";
        s.productsStatus = "succeeded";
        s.brand          = a.payload.brand;
        s.products       = normalizeProducts(a.payload.products);
        s.pagination     = a.payload.pagination || {};
      })
      .addCase(fetchSingleBrand.rejected, (s, a) => {
        s.brandStatus    = "failed";
        s.productsStatus = "failed";
        s.error          = a.payload;
      })

      // Products only (brands listing page)
      .addCase(fetchBrandProducts.pending,   (s) => { s.productsStatus = "loading"; s.error = null; })
      .addCase(fetchBrandProducts.fulfilled, (s, a) => {
        s.productsStatus = "succeeded";
        s.products       = normalizeProducts(a.payload.products);
        s.pagination     = a.payload.pagination;
      })
      .addCase(fetchBrandProducts.rejected,  (s, a) => {
        s.productsStatus = "failed";
        s.error          = a.payload;
      });
  },
});

export const {
  togglePriceRange, toggleCategory, toggleDiscount,
  toggleBrandFilter, setSortBy, setPage, clearAllFilters,
  clearBrand, setActiveBanner, toggleWishlist,
} = brandsSlice.actions;

export const selectBanners        = (s) => s.brands.banners;
export const selectBrands         = (s) => s.brands.brands;
export const selectCategories     = (s) => s.brands.categories; // ← Add this
export const selectFilters        = (s) => s.brands.filters;
export const selectWishlist       = (s) => s.brands.wishlist;
export const selectActiveBanner   = (s) => s.brands.activeBanner;
export const selectProductsStatus = (s) => s.brands.productsStatus;
export const selectProducts       = (s) => s.brands.products;
export const selectPagination     = (s) => s.brands.pagination;
export const selectBrand          = (s) => s.brands.brand;
export const selectBrandStatus    = (s) => s.brands.brandStatus;

export default brandsSlice.reducer;