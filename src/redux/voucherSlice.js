import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vouchers: [],
    status: 'idle',
    error: null,
}

const voucherSlice = createSlice({
    name: 'vouchers',
    initialState,
    reducers: {
        setVouchers: (state, action) => {
            state.vouchers = action.payload;
            state.status = 'succeeded';
        },
        setLoading: (state) => {
            state.status = 'loading'
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
});

export const { setVouchers, setLoading, setError } = voucherSlice.actions;
export default voucherSlice.reducer;