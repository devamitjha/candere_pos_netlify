import { createSlice } from '@reduxjs/toolkit';

// Function to load state from localStorage
const loadStateFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (error) {
    console.error('Could not load state from localStorage', error);
    return null;
  }
};

// Initial state loaded from localStorage or defaults to null
const initialState = {
  nearbyStores: loadStateFromLocalStorage('nearbyStores') || null,
  selectedStore: loadStateFromLocalStorage('selectedStore') || null,
};

const nearbyStoreSlice = createSlice({
  name: 'nearbyStore',
  initialState,
  reducers: {
    setNearbyStores: (state, action) => {
      state.nearbyStores = action.payload;
      localStorage.setItem('nearbyStores', JSON.stringify(action.payload));
    },
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
      localStorage.setItem('selectedStore', JSON.stringify(action.payload));
    },
  },
});

export const { setNearbyStores, setSelectedStore } = nearbyStoreSlice.actions;
export default nearbyStoreSlice.reducer;
