// features/bottomSheetSlice.js
import { createSlice } from '@reduxjs/toolkit';

const bottomSheetSlice = createSlice({
    name: 'bottomSheet',
    initialState: {
        isSheetOpen: false,
        isSheetId: null,
    },
    reducers: {
        sheetOpen: (state, action) => {
            state.isSheetId = action.payload;
            state.isSheetOpen = true;
        },
        sheetClose: (state) => {
            state.isSheetOpen = false;
            state.isSheetId = null;
        }
    }
});

export const { sheetOpen, sheetClose } = bottomSheetSlice.actions;
export default bottomSheetSlice.reducer;
