import { createSlice } from '@reduxjs/toolkit';

// Helper function to load the selected address and isSelectedAddress from local storage
const loadAddressFromLocalStorage = () => {
  const savedAddress = localStorage.getItem('selectedAddress');
  const isSelectedAddress = localStorage.getItem('isSelectedAddress');
  return {
    selectedAddress: savedAddress ? JSON.parse(savedAddress) : "",
    isSelectedAddress: isSelectedAddress || false,
  };
};

const selectedAddressSlice = createSlice({
  name: 'selectedAddress',
  initialState: loadAddressFromLocalStorage(), // Initialize state from local storage
  checkboxChecked:false,
  reducers: {
    setSelectedAddress: (state, action) => {
      const newAddress = action.payload;
      state.selectedAddress = newAddress;
      state.isSelectedAddress = true;
      
      // Save to localStorage
      localStorage.setItem('selectedAddress', JSON.stringify(newAddress));
      localStorage.setItem('isSelectedAddress', 'true');
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = "";
      state.isSelectedAddress = false;
      // Clear from localStorage
      localStorage.removeItem('selectedAddress');
      localStorage.setItem('isSelectedAddress', 'false');
    },
    setCheckboxChecked:(state, action)=>{
      state.checkboxChecked = action.payload;
    }
  },
});

export const { setSelectedAddress, clearSelectedAddress, setCheckboxChecked } = selectedAddressSlice.actions;

// Selector to get the selected address and isSelectedAddress flag from the store
export const selectSelectedAddress = (state) => state.selectedAddress.selectedAddress;
export const selectIsSelectedAddress = (state) => state.selectedAddress.isSelectedAddress;

export default selectedAddressSlice.reducer;