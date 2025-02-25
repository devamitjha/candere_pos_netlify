// src/redux/menuSlice.js

import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    isMenuOpen: false,
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    menuClose: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleMenu, menuClose } = menuSlice.actions;
export default menuSlice.reducer;
