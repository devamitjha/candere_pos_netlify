import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
  barcodeData:'' ,
  barcodeItems: [],
  loadingProduct: false,
  barcodeError: null,
};

const barCodeSlice = createSlice({
  name: 'barcode',
  initialState,
  reducers: {
    barcodeSet: (state, action) => {
      state.barcodeData = action.payload;
    },
    fetchBarcodeProductStart(state) {
      state.loadingProduct = true;
      state.barcodeError = null;
    },
    fetchBarcodeProductsSuccess(state, action) {
        state.barcodeItems = action.payload;
        state.loadingProduct = false;
    },
    fetchBarcodeProductsFailure(state, action) {
        state.barcodeError ="not found";
        state.loadingProduct = false;
        state.barcodeItems = []
    }
  }
});

export const { barcodeSet, fetchBarcodeProductStart, fetchBarcodeProductsSuccess, fetchBarcodeProductsFailure} = barCodeSlice.actions;
export default barCodeSlice.reducer;

export const fetchBarcodeProducts = (searchProduct, storeCode, agentCodeOrPhone, customer_id, newBarcode) => async (dispatch) => {
  // if (!searchProduct.trim()) return;
  if (!newBarcode && !searchProduct.trim()) return;

  dispatch(fetchBarcodeProductStart());

  try {
      const response = await axios.post(
          '/rest/V1/pos-productmanagement/productsearch',
          JSON.stringify({
            "storeCode": storeCode,
            "agentCode": agentCodeOrPhone,
            "customerId": customer_id,
            "searchTerm": "",
            "barcode": newBarcode
          }),
          {
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta', 
            },
          }
      );

      dispatch(fetchBarcodeProductsSuccess(response.data)); // Save products to the store
  } catch (error) {
      dispatch(fetchBarcodeProductsFailure()); // Save the error message to the store
  }
}