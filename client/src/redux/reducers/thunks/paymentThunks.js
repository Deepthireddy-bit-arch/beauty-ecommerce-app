import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Calls your Express route: POST /api/payment/create-payment-intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/payment/create-payment-intent', { amount });
      return data.clientSecret; // string
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Payment initiation failed');
    }
  }
);