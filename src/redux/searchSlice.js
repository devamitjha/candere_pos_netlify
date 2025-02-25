import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    loading: false,
    error: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        fetchProductsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
        },
        fetchProductsFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = searchSlice.actions;

export default searchSlice.reducer;

export const fetchProducts = (searchProduct, storeCode, agentCodeOrPhone, customer_id, barCode) => async (dispatch) => {
    // if (!searchProduct.trim()) return;
    if (!barCode && !searchProduct.trim()) return;

    dispatch(fetchProductsStart());

    try {
        const response = await axios.post(
            '/api/V1/pos-productmanagement/productsearch',
            JSON.stringify({
              "storeCode": storeCode,
              "agentCode": agentCodeOrPhone,
              "customerId": customer_id,
              "searchTerm": searchProduct,
              "barcode": ""
            }),
            {
              headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta', 
              },
            }
        );

        dispatch(fetchProductsSuccess(response.data.products)); // Save products to the store
    } catch (error) {
        dispatch(fetchProductsFailure(error.message)); // Save the error message to the store
    }
}