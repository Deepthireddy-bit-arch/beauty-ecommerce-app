import { createSlice } from '@reduxjs/toolkit';
import { createOrder, getMyOrders, getOrderById } from '../reducers/thunks/orderThunks';







// ── Slice ────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    myOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true; state.error = null; state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });

    // getMyOrders
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false; state.myOrders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });

    // getOrderById
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false; state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  },
});

export const { clearOrderState, clearError } = orderSlice.actions;
export default orderSlice.reducer;