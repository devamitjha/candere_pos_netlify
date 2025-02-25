// productSearchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSearchSlice = createSlice({
  name: 'productSearch',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    searchRequest(state) {
      state.loading = true;
      state.error = null;
    },
    searchSuccess(state, action) {
      state.products = action.payload;
      state.loading = false;
    },
    searchFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { searchRequest, searchSuccess, searchFailure } = productSearchSlice.actions;

export default productSearchSlice.reducer;
