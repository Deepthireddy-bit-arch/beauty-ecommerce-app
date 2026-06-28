// ── Thunks ──────────────────────────────────────────────

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../../../api/endpoints";

import api from "../../../api/axios";



// Helper: auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_ENDPOINTS.orders}`, orderData, authHeader());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'order/myOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_ENDPOINTS.orders}/myorders`, authHeader());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${API_ENDPOINTS.orders}/${id}`, authHeader());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);
// export const cancelOrderAsync = (orderId) => async (dispatch) => {
//   try {
//     const { data } = await axiosInstance.put(`/orders/${orderId}/cancel`);
//     // refresh the list and update selectedOrder
//     dispatch(getMyOrders());
//     dispatch(getOrderById(orderId));
//     toast.success('Order cancelled successfully.');
//     return data;
//   } catch (err) {
//     toast.error(err.response?.data?.message || 'Failed to cancel order.');
//   }
// };
export const cancelOrderAsync = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `${API_ENDPOINTS.orders}/${orderId}/cancel`,
        {},
        authHeader()
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
);