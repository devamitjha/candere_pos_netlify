import { createSlice } from '@reduxjs/toolkit';

const loadAgentDataFromStorage = () => {
  const storeCode = localStorage.getItem('storeCode');
  const storeName = localStorage.getItem('storeName');
  const storeAddress = localStorage.getItem('storeAddress');
  const storePinCode = localStorage.getItem('storePinCode');
  const storePhone = localStorage.getItem('storePhone');
  const storedData = localStorage.getItem('agentData');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //for agent
   const city= localStorage.getItem('city');
   const region= localStorage.getItem('region');
   const region_id= localStorage.getItem('region_id');
   const country_code= localStorage.getItem('country_code');
  //for agent
  
  return storedData 
    ? { ...JSON.parse(storedData), isLoggedIn, storeCode, storeName, storeAddress, storePinCode, storePhone, city, region, region_id, country_code } 
    : { isLoggedIn: false, storeCode };
};

const initialState = loadAgentDataFromStorage() || {
  agentCodeOrPhone: '',
  isLoggedIn: false,
  loading: false,
  storeCode: '', 
  storeName:'',
  storeAddress:'',
  storePinCode:'',
  storePhone: '',
  city:'',
  region:'',
  region_id:'',
  country_code:'',
};

const agentSlice = createSlice({
  
  name: 'agent',
  initialState,
  reducers: {

    loginStart(state) {
      state.loading = true;
    },

    loginSuccess(state, action) {

      state.agentCodeOrPhone = action.payload.agentCodeOrPhone;
      state.storeCode = action.payload.store_Code;
      state.storeName = action.payload.store_name;
      state.storeAddress = action.payload.store_address;
      state.storePinCode = action.payload.storePinCode;
      state.storePhone = action.payload.storePhone;

      state.city = action.payload.city;
      state.region = action.payload.region;
      state.region_id = action.payload.region_id;
      state.country_code = action.payload.country_code;

      state.isLoggedIn = true;
      state.loading = false;
      
      localStorage.setItem('isLoggedIn', true); 
      localStorage.setItem('agentData', JSON.stringify({
        agentCodeOrPhone: action.payload.agentCodeOrPhone,
        pin: action.payload.pin,
        storeCode: action.payload.store_Code, 
        storeName: action.payload.store_name, 
        storeAddress: action.payload.store_address, 
        storePinCode: action.payload.storePinCode, 
        storePhone: action.payload.storePhone, 
        city: action.payload.city,
        region: action.payload.region,
        region_id: action.payload.region_id,
        country_code: action.payload.country_code,
      }));
    },
    loginFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.agentCodeOrPhone = '';        
      state.isLoggedIn = false;
      state.storeCode = ''; 
      state.storeName = ''; 
      state.storeAddress = ''; 
      state.storePinCode = ''; 
      state.storePhone = ''; 
      state.city = ''; 
      state.region = ''; 
      state.region_id = ''; 
      state.country_code = ''; 
      
      localStorage.removeItem('agentData'); 
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('storeCode'); 
      localStorage.removeItem('storeName'); 
      localStorage.removeItem('storeAddress'); 
      localStorage.removeItem('storePinCode'); 
      localStorage.removeItem('storePhone'); 
      localStorage.removeItem('userData'); 
      localStorage.removeItem('loginCartCount'); 
      localStorage.removeItem('city'); 
      localStorage.removeItem('region'); 
      localStorage.removeItem('region_id'); 
      localStorage.removeItem('country_code'); 
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = agentSlice.actions;

export default agentSlice.reducer;
