import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalProducts:0,
  productType:[],
  loading: false, // Add loading state
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Append new products to the existing list
    setProducts: (state, action) => {
      state.items = [...state.items, ...action.payload]; // Append products
      state.loading = false;
    },
    setTotalProducts:(state,action)=>{
      state.totalProducts=action.payload
    },
    setProductType:(state,action)=>{
      state.productType=action.payload
    },
    clearProducts: (state) => {
      state.items = []; // Clear products when category changes
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setLoading, setTotalProducts, setProductType, clearProducts } = productSlice.actions;

export default productSlice.reducer;
