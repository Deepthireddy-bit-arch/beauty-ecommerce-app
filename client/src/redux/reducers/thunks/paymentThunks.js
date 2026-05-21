// paymentThunks.js — fixed
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (amount, { rejectWithValue }) => {  // ← removed getState
    try {
      const { data } = await axios.post(
        '/api/payments/create-payment-intent',
        { amount }
        // ← no auth header needed if route is public
      );
      return data.clientSecret;
    } catch (err) {
      console.error('Full error:', err);
      console.error('Response:', err.response?.status, err.response?.data);
      return rejectWithValue(err.response?.data?.error || 'Payment initiation failed');
    }
  }
);