import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Initial state: Load from localStorage if available, otherwise set to true
const initialState = {
  isChecked: JSON.parse(localStorage.getItem('insuranceChecked')) !== null
    ? JSON.parse(localStorage.getItem('insuranceChecked'))
    : true, // Default checked on the first visit
};

// The insurance slice that handles Redux state and localStorage
const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    toggleCheckbox: (state) => {
      state.isChecked = !state.isChecked;
      localStorage.setItem('insuranceChecked', JSON.stringify(state.isChecked));
    },
    setCheckbox: (state, action) => {
      state.isChecked = action.payload;
      localStorage.setItem('insuranceChecked', JSON.stringify(state.isChecked));
    },
  },
});

// Actions generated from the slice
export const { toggleCheckbox, setCheckbox } = insuranceSlice.actions;

// The reducer for the insurance slice
export default insuranceSlice.reducer;

// API service function: Apply insurance based on checkbox state
export const applyInsurance = async (customer_id, checked) => {
  const data = JSON.stringify({
    query: `mutation InsuranceApply($input: InsuranceApplyInput!) {
      InsuranceApply(input: $input) {
        status
        message
      }
    }`,
    variables: { "input": { "customer_id": customer_id, "insurance_checbox": checked } }
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/graphql', // Ensure this is the correct URL for your API
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data; // Return the response for further use
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
    throw error; // Throw the error to handle it in the calling component
  }
};
