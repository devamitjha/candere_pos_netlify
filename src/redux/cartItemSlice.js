import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartItemSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    addCartItem: (state, action) => {
      state.cartItems.push(action.payload);
    },
    updateCartItem: (state, action) => {
      const index = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
      if (index !== -1) {
        state.cartItems[index] = action.payload;
      }
    },
    removeCartItem: (state, action) => {
      const productId = action.payload.product_id;
      state.cartItems = state.cartItems.filter(item => item.quote_item !== productId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCartItems, addCartItem, updateCartItem, removeCartItem, setLoading, setError } = cartItemSlice.actions;
export default cartItemSlice.reducer;
