import { createSlice } from '@reduxjs/toolkit';

// Initial state for the order total
const initialState = {
  orderTotal: null, // This will store the cart summary data
  loading: false,
  error: null
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    // Action to set the cart summary data
    setOrderTotal: (state, action) => {
      state.orderTotal = action.payload;
      state.loading = false;
    },
    // Action to set the loading state when fetching data
    setLoading: (state) => {
      state.loading = true;
    },
    // Action to handle any errors
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setOrderTotal, setLoading, setError } = orderSummarySlice.actions;

export default orderSummarySlice.reducer;
