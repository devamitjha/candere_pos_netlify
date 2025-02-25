import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [], // This will store the customer addresses
  loading: false,
  error: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setAddresses, setLoading, setError } = addressSlice.actions;
export default addressSlice.reducer;
