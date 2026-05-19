import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

/* -------------------------
   FETCH PRODUCTS (LIST)
--------------------------*/
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().products;

      const search = state.searchQuery;
      const category = state.selectedCategory;
      const sort = state.sortBy;
      const page = state.page || 1;

      let sortField = "createdAt";
      let order = "desc";

      if (sort === "price_asc") {
        sortField = "price";
        order = "asc";
      } else if (sort === "price_desc") {
        sortField = "price";
        order = "desc";
      } else if (sort === "name_asc") {
        sortField = "name";
        order = "asc";
      }

      const response = await api.get(API_ENDPOINTS.products, {
        params: {
          search,
          page,
          limit: 10,
          sort: sortField,
          order,
          category
        }
      });

      // Optional: show success toast only if you want to confirm load
      // toast.success('Products loaded successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to load products';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/* -------------------------
   FETCH PRODUCT BY ID
--------------------------*/
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