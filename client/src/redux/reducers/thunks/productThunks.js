import { createAsyncThunk } from '@reduxjs/toolkit';
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

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      return response.data.product; //the data inside the product called as destructurring from the response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);