import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerInfo: JSON.parse(localStorage.getItem('CustomerAddressData'))?.customerInfo || null,
  addresses: JSON.parse(localStorage.getItem('CustomerAddressData'))?.addresses || [],
  loading: false,
  error: null,
};

const customerAddressSlice = createSlice({
  name: 'customerAddress',
  initialState,
  reducers: {
    setCustomerAddressData: (state, action) => {
      const { customerInfo, addresses } = action.payload;

      // Ensure addresses is an array before proceeding
      const validAddresses = Array.isArray(addresses) ? addresses : [];

      // Update state
      state.customerInfo = { ...state.customerInfo, ...customerInfo }; // Merge customerInfo
      state.addresses = [...state.addresses, ...validAddresses]; // Append new addresses
      state.loading = false;

      // Prepare data for local storage
      const updatedData = {
        customerInfo: state.customerInfo,
        addresses: state.addresses,
      };

      // Save the entire customer data in localStorage
      localStorage.setItem('CustomerAddressData', JSON.stringify(updatedData));
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCustomerAddressData: (state) => {
      state.customerInfo = null;
      state.addresses = [];
      localStorage.removeItem('CustomerAddressData'); // Clear from localStorage
    },
  },
});

// Exporting the actions and reducer
export const { setCustomerAddressData, setLoading, setError, clearCustomerAddressData } = customerAddressSlice.actions;
export default customerAddressSlice.reducer;
