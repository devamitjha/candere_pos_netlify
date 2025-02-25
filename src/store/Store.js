// store.js
import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../redux/menuSlice';
import bottomSheetReducer from '../redux/bottomSheetSlice';
import productReducer from "../redux/productSlice";
import agentReducer from '../redux/agentSlice';
import userSlice from '../redux/userSlice';
import atcSlice from "../redux/atcSlice";
import cartItemSlice from '../redux/cartItemSlice';
import insuranceSlice from '../redux/insuranceSlice';
import orderSummarySlice from '../redux/orderSummarySlice';
import addressSlice from "../redux/addressSlice";
import selectedAddressSlice from "../redux/selectedAddressSlice";
import searchSlice from "../redux/searchSlice";
import customerSearchBoxReducer from '../redux/customerSearchBoxSlice';
import barcodeSlice from '../redux/barcodeSlice';
import customerAddressSlice from "../redux/customerAddressSlice";
import voucherReducer from '../redux/voucherSlice';
import nearbyStoreReducer from '../redux/nearbyStoreSlice';

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        bottomSheet: bottomSheetReducer,
        products: productReducer,
        agent: agentReducer,
        user:userSlice,
        atc:atcSlice,
        cartItems:cartItemSlice,
        insurance:insuranceSlice,
        orderSummary:orderSummarySlice,
        address:addressSlice,
        selectedAddress: selectedAddressSlice,
        search:searchSlice,
        customerSearchBox: customerSearchBoxReducer,
        barcode:barcodeSlice,
        customerAddress:customerAddressSlice,
        vouchers: voucherReducer,
        nearbyStore: nearbyStoreReducer,
    },
});

