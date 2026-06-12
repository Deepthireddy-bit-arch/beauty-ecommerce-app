import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

/* -------------------------
   FETCH PRODUCTS (LIST)
--------------------------*/
// export const fetchProducts = createAsyncThunk(
//   'products/fetchAll',
//   async (filters, { rejectWithValue }) => {
//     try {
//       const {
//         search,
//         category,
//         brands,
//         priceRanges,
//         discounts,
//         sortBy,
//         page,
//         limit
//       } = filters;

//       let sortField = "createdAt";
//       let order = "desc";

//       if (sortBy === "price-low") {
//         sortField = "price";
//         order = "asc";
//       } else if (sortBy === "price-high") {
//         sortField = "price";
//         order = "desc";
//       }

//       const params = {
//         search,
//         page,
//         limit,
//         sort: sortField,
//         order
//       };

//       if (category && category !== "All") params.category = category;
//       if (brands?.length) params.brands = brands.join(',');
//       if (discounts?.length) params.discounts = discounts.join(',');
//       if (priceRanges) params.priceRanges = priceRanges;

//       const response = await api.get(API_ENDPOINTS.products, { params });

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );
/* -------------------------
   FETCH PRODUCT BY ID
--------------------------*/
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const {
        search,
        category,
        brands,
        priceRanges,
        discounts,
        sortBy,
        page,
        limit
      } = filters;

      const params = {};

      if (search) params.search = search;
      if (page) params.page = page;
      if (limit) params.limit = limit;
      if (sortBy) params.sortBy = sortBy;

      if (category && category !== 'All') params.categories = category;

      // ✅ ADD HERE — safe array guards before .join()
      const brandsArr = Array.isArray(brands) ? brands : brands ? [brands] : [];
      const discountsArr = Array.isArray(discounts) ? discounts : discounts ? [discounts] : [];

      if (brandsArr.length) params.brands = brandsArr.join(',');
      if (discountsArr.length) params.discounts = discountsArr.join(',');

      if (priceRanges) params.priceRanges = priceRanges;

      const response = await api.get(API_ENDPOINTS.products, { params });
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.products}/${id}`);
      // toast.success('Product loaded');
      return response.data.product;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to load product details';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.products}`, {
        params: { sortBy: 'featured', limit: 20 }
      });
      // controller returns isFeatured:true products under `data` key
      return res.data.data || res.data.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);