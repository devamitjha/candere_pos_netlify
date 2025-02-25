import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isBoxOpen: false,
}

const customerSearchBoxSlice = createSlice({
    name: "customerSearchBox",
    initialState,
    reducers: {
        toggleBox: (state) => {
            state.isBoxOpen = !state.isBoxOpen
        }
    }
})

export const { toggleBox } = customerSearchBoxSlice.actions;
export default customerSearchBoxSlice.reducer;