import { createSlice } from '@reduxjs/toolkit';

const loadUserDataFromStorage = () => {
  const storedUser = localStorage.getItem('userData');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    return {
      isUser: true, 
      ...parsedUser
    };
  }
  return { isUser: false, userName: '', email: '', phone: '',  customer_id:'', token:'', sessionId:'' };
};

const initialState = {
  ...loadUserDataFromStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isUser = true;
      state.customer_id = action.payload.customer_id;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.token = action.payload.token;
      state.sessionId=action.payload.session_id
    },
    logoutUser(state) {
      state.isUser = false;
      state.customer_id = '';
      state.userName = '';
      state.email = '';
      state.phone = '';
      state.token = '';
      state.sessionId = '';
      localStorage.removeItem('userData'); // Clear localStorage on logout
      localStorage.removeItem('userBillingAddress'); 
      localStorage.removeItem('userToken'); 
      localStorage.removeItem('methodActive'); 
      localStorage.removeItem('customerFirstName'); 
      localStorage.removeItem('customerLastName'); 
      localStorage.removeItem('CustomerAddressData'); 
      localStorage.removeItem('sessionId'); 
    }
  }
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
