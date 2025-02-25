import { createSlice } from '@reduxjs/toolkit';

// Load quoteId and quoteMask from localStorage if available
const quoteIdFromStorage = localStorage.getItem('quoteId');
const quoteMaskFromStorage = localStorage.getItem('quoteMask');
const cartCountFromStorage = localStorage.getItem('loginCartCount'); 
const grandTotalFromStorage = localStorage.getItem('grandTotal'); 

const initialState = {
  isAdding: false,
  cartItems: [],
  quoteId: quoteIdFromStorage || null,    // Initialize with localStorage value if available
  quoteMask: quoteMaskFromStorage || null, // Initialize with localStorage value if available
  cartCount: cartCountFromStorage ? parseInt(cartCountFromStorage) : 0, // Initialize cart count
  error: null,
  disabled:true,
  grandTotal:grandTotalFromStorage || 0,
  setBillingShippingAddress:false,
  cashMethod:false,
  walletMethod:false,
  showCashPaymentPopup:false
};

const atcSlice = createSlice({
  name: 'atc',
  initialState,
  reducers: {
    addProductStart(state) {
      state.isAdding = true;
      state.error = null;
    },
    addProductSuccess(state, action) {
      state.isAdding = false;
      state.cartItems.push(action.payload.item);
      state.quoteId = action.payload.quoteId;   // Update quoteId
      state.quoteMask = action.payload.quoteMask; // Update quoteMask

      // Also save them to localStorage
      localStorage.setItem('quoteId', action.payload.quoteId);
      localStorage.setItem('quoteMask', action.payload.quoteMask);
    },
    addProductFailure(state, action) {
      state.isAdding = false;
      state.error = action.payload;
    },
    deleteProduct(state, action) {
      state.cartItems = state.cartItems.filter(item => item.product_id !== action.payload.product_id);
    },
    setCartItems(state, action) {
      state.cartItems = action.payload;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
      localStorage.setItem('loginCartCount', action.payload); // Save to localStorage
    },
    clearCart(state) {
      state.cartItems = [];
      localStorage.removeItem('loginCartCount'); // Clear cart count from localStorage
      state.quoteMask = null;
      state.quoteId = null;
      localStorage.removeItem('quoteId');
      localStorage.removeItem('quoteMask');
      localStorage.removeItem('selectedAddress');
      state.cartCount = null;
    },
    setDisabled(state, action){
      state.disabled = action.payload;
    },
    setBillingShipping(state, action){
      state.setBillingShippingAddress = action.payload;
    },
    removeCartCount(state){
      state.cartCount = null
    },
    addQuoteId(state, action){
      state.quoteId = action.payload; 
      localStorage.setItem('quoteId', action.payload);
    },
    setGT(state, action){
      state.grandTotal = action.payload.grandTotal;
      state.walletMethod = action.payload.walletMethod;
    },
    setCashMethod(state, action){
      state.cashMethod = action.payload;
    },
    cashPaymentPopup(state, action){
      state.showCashPaymentPopup = action.payload;
    }
  },
});

export const { addProductStart, addProductSuccess, addProductFailure, deleteProduct, setCartItems, setCartCount, clearCart, setDisabled, removeCartCount, addQuoteId, setGT, setBillingShipping, setCashMethod, walletMethod, cashPaymentPopup} = atcSlice.actions;

export default atcSlice.reducer;

