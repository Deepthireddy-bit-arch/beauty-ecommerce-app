import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newArrivalService } from '../../api/newArrivalService';


// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchNewArrivals = createAsyncThunk(
  'newArrivals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await newArrivalService.getAll();
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchNewArrivalById = createAsyncThunk(
  'newArrivals/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await newArrivalService.getById(id);
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);





// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  items:        [],
  selected:     null,
  loading:      false,
  actionLoading:false,   // spinner for create / update / delete
  error:        null,
  successMsg:   null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const newArrivalsSlice = createSlice({
  name: 'newArrivals',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error      = null;
      state.successMsg = null;
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchAll ──
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // ── fetchById ──
    builder
      .addCase(fetchNewArrivalById.pending, (state) => {
        state.loading  = true;
        state.error    = null;
        state.selected = null;
      })
      .addCase(fetchNewArrivalById.fulfilled, (state, action) => {
        state.loading  = false;
        state.selected = action.payload;
      })
      .addCase(fetchNewArrivalById.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

   
   
  },
});

export const { clearMessages, clearSelected } = newArrivalsSlice.actions;
export default newArrivalsSlice.reducer;