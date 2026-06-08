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
      const { data } = await axios.get(`${BASE}/brands/with-count`);
      return data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchBrandProducts = createAsyncThunk(
  "brands/fetchProducts",
  async (filters = {}, { rejectWithValue, getState }) => {
    console.log("Filters received:", filters);
    try {
      const params = new URLSearchParams();

      // ── FIXED: brand filter was sending _id values (e.g. 6a1e68f8...)
      //    but products store brand as a name string (e.g. "Maybelline").
      //    The brands collection _id and product.brandId are mismatched in the DB.
      //    Solution: look up the brand name from the brands list and send that instead.
      if (filters.brands?.length) {
        const allBrands = getState().brands.brands;        // [{_id, name, ...}]
        const brandNames = filters.brands
          .map((id) => allBrands.find((b) => b._id === id)?.name)
          .filter(Boolean);
        if (brandNames.length) params.set("brands", brandNames.join(","));
      }

      if (filters.categories?.length)  params.set("categories",  filters.categories.join(","));
      if (filters.priceRanges?.length) params.set("priceRanges", filters.priceRanges.join(","));
      if (filters.discounts?.length)   params.set("discounts",   filters.discounts.join(","));
      if (filters.sortBy)              params.set("sortBy",       filters.sortBy);
      if (filters.page)                params.set("page",         filters.page);

      const { data } = await axios.get(`${BASE}/products?${params.toString()}`);
      return { products: data.data, pagination: data.pagination };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ─── SLICE ───────────────────────────────────────────────────────────────────

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    banners:        [],
    bannersStatus:  "idle",
    brands:         [],
    brandsStatus:   "idle",
    products:       [],
    productsStatus: "idle",
    pagination:     {},
    error:          null,
    filters: {
      priceRanges: [],
      categories:  [],
      discounts:   [],
      brands:      [],
      sortBy:      "featured",
      page:        1,
    },
    activeBanner: 0,
    wishlist:     {},
  },

  reducers: {
    togglePriceRange: (state, { payload }) => {
      const i = state.filters.priceRanges.indexOf(payload);
      i === -1
        ? state.filters.priceRanges.push(payload)
        : state.filters.priceRanges.splice(i, 1);
      state.filters.page = 1;
    },
    toggleCategory: (state, { payload }) => {
      const i = state.filters.categories.indexOf(payload);
      i === -1
        ? state.filters.categories.push(payload)
        : state.filters.categories.splice(i, 1);
      state.filters.page = 1;
    },
    toggleDiscount: (state, { payload }) => {
      const i = state.filters.discounts.indexOf(payload);
      i === -1
        ? state.filters.discounts.push(payload)
        : state.filters.discounts.splice(i, 1);
      state.filters.page = 1;
    },
    toggleBrandFilter: (state, { payload }) => {
      console.log("Clicked Brand ID:", payload);
      const i = state.filters.brands.indexOf(payload);
      i === -1
        ? state.filters.brands.push(payload)
        : state.filters.brands.splice(i, 1);
      state.filters.page = 1;
    },
    setSortBy: (state, { payload }) => {
      state.filters.sortBy = payload;
      state.filters.page   = 1;
    },
    setPage: (state, { payload }) => {
      state.filters.page = payload;
    },
    clearAllFilters: (state) => {
      state.filters = {
        priceRanges: [], categories: [], discounts: [],
        brands: [], sortBy: "featured", page: 1,
      };
    },
    setActiveBanner: (state, { payload }) => { state.activeBanner = payload; },
    toggleWishlist:  (state, { payload }) => { state.wishlist[payload] = !state.wishlist[payload]; },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandBanners.pending,   (s) => { s.bannersStatus = "loading"; })
      .addCase(fetchBrandBanners.fulfilled, (s, a) => { s.bannersStatus = "succeeded"; s.banners = a.payload; })
      .addCase(fetchBrandBanners.rejected,  (s) => { s.bannersStatus = "failed"; })

      .addCase(fetchBrands.pending,   (s) => { s.brandsStatus = "loading"; })
      .addCase(fetchBrands.fulfilled, (s, a) => { s.brandsStatus = "succeeded"; s.brands = a.payload; })
      .addCase(fetchBrands.rejected,  (s) => { s.brandsStatus = "failed"; })

      .addCase(fetchBrandProducts.pending,   (s) => { s.productsStatus = "loading"; s.error = null; })
      .addCase(fetchBrandProducts.fulfilled, (s, a) => {
        s.productsStatus = "succeeded";
        s.products = a.payload.products.map(p => ({
          ...p,
          image:      p.images?.[0] || "",
          mrp:        p.originalPrice || p.price,
          discount:   p.discount || 0,
          bestseller: p.isBestseller || false,
          reviews:    p.reviews || 0,
          shades:     p.shades || 1,
          tag:        p.tag || "",
        }));
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchBrandProducts.rejected, (s, a) => {
        s.productsStatus = "failed";
        s.error = a.payload;
      });
  },
});

export const {
  togglePriceRange, toggleCategory, toggleDiscount,
  toggleBrandFilter, setSortBy, setPage, clearAllFilters,
  setActiveBanner, toggleWishlist,
} = brandsSlice.actions;

export const selectBanners        = (s) => s.brands.banners;
export const selectBrands         = (s) => s.brands.brands;
export const selectFilters        = (s) => s.brands.filters;
export const selectWishlist       = (s) => s.brands.wishlist;
export const selectActiveBanner   = (s) => s.brands.activeBanner;
export const selectProductsStatus = (s) => s.brands.productsStatus;
export const selectProducts       = (s) => s.brands.products;
export const selectPagination     = (s) => s.brands.pagination;

export default brandsSlice.reducer;