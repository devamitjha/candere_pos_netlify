import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../../assets/images/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
import "./login.scss";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/agentSlice';
import { setNearbyStores } from '../../redux/nearbyStoreSlice';


const validateAgentCodeOrPhone = (agentCodeOrPhone) => {
  const phoneRegex = /^[0-9]{10}$/; 
  return agentCodeOrPhone.length > 0 || phoneRegex.test(agentCodeOrPhone);
};
const validatePin = (pin) => {
  return pin.length === 6; 
};

const Login = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.agent.isLoggedIn);

  const [agentCodeOrPhone, setAgentCodeOrPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ agentCodeOrPhone: '', pin: '' });

  useEffect(() => {    
    if (isLoggedIn) {
      navigate('/categories');
    }
  }, [isLoggedIn, navigate]);

  const dispatch = useDispatch();

const handleSubmit = async (event) => {
  event.preventDefault();
  
  const pinCode = pin.join('');
  let valid = true;
  let validationErrors = { agentCodeOrPhone: '', pin: '' };
  
  if (!validateAgentCodeOrPhone(agentCodeOrPhone)) {
    validationErrors.agentCodeOrPhone = 'Please enter a valid agent code or phone number.';
    valid = false;
  }
  
  if (!validatePin(pinCode)) {
    validationErrors.pin = 'PIN must be exactly 6 characters long.';
    valid = false;
  }
  
  if (!valid) {
    setErrors(validationErrors);
    return;
  }

  dispatch(loginStart());
  setLoading(true);

  let data = JSON.stringify({
    "user_id": agentCodeOrPhone,
    "pass": pinCode
  });

  let config = {
    method: 'post',
    url: '/api/V1/pos-agentmanagement/agentlogin',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
    },
    withCredentials: true,
    data: data
  };

  try {
    const response = await axios.request(config);

    if (response.status) {
      console.log(response);
      let store_Code = response.data.responseData.store_code;
      let store_name = response.data.responseData.store_details.place_name;
      let store_address = response.data.responseData.store_details.address;
      let storePinCode = response.data.responseData.store_details.zipcode;
      let storePhone = response.data.responseData.store_details.phone;

      let nearbyStore = response.data.responseData.store_details.near_by_stores_data;
      //const storesArray = Array.isArray(nearbyStore) ? nearbyStore : Object.values(nearbyStore);

      //for agent
        let city=response.data.responseData.store_details.city
        let region=response.data.responseData.store_details.region_code
        let region_id=response.data.responseData.store_details.region_id
        let country_code=response.data.responseData.store_details.country_id
      //for agent
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('agentData', JSON.stringify({ agentCodeOrPhone }));
        localStorage.setItem('storeCode', store_Code);
        localStorage.setItem('storeName', response.data.responseData.store_details.place_name);
        localStorage.setItem('storeAddress', response.data.responseData.store_details.address);
        localStorage.setItem('storePinCode', response.data.responseData.store_details.zipcode);
        localStorage.setItem('storePhone', response.data.responseData.store_details.phone);
      
      //for agent
        localStorage.setItem('city', response.data.responseData.store_details.city);
        localStorage.setItem('region', response.data.responseData.store_details.region_code);
        localStorage.setItem('region_id', response.data.responseData.store_details.region_id);
        localStorage.setItem('country_code', response.data.responseData.store_details.country_id);
      //for agent

      dispatch(loginSuccess({ agentCodeOrPhone, store_Code, store_name, store_address, storePinCode, storePhone, city, region, region_id, country_code}));
     // dispatch(setNearbyStores(storesArray));
      navigate('/categories');
    } else {
      toast.error('Invalid agent code or PIN');
      dispatch(loginFailure());
    }
  } catch (error) {
    console.error('Error during validation:', error);
    toast.error('Login failed. Please try again.');
    dispatch(loginFailure());
  } finally {
    setLoading(false);
  }
};

  const handlePinChange = (event, index) => {
    const { value } = event.target;
    if (/^[a-zA-Z0-9]?$/.test(value)) { 
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < pin.length - 1) {
        document.getElementById(`pin-${index + 1}`).focus();
      } else if (!value && index > 0) {
        document.getElementById(`pin-${index - 1}`).focus();
      }
    }
  };

  return (
    <div className="loginPage">
      <img src={logo} alt="Candere - A Kalyan Jewellers" className="login--logo" />
      <div className="login--box">
        <div className="handler">
          <span className="handler--shape"></span>
        </div>
        <div className="headingBox">
          <p className="headingBox--title">Store Login</p>
        </div>
        <form onSubmit={handleSubmit} className="login--form">
          <div className="input_group_container">
            <div className="input_group_">
              <input
                className="input_type_text"
                type="text"
                placeholder="Enter Agent Code"
                value={agentCodeOrPhone}
                onChange={(e) => setAgentCodeOrPhone(e.target.value)}
                required
              />
              {errors.agentCodeOrPhone && <p className="error">{errors.agentCodeOrPhone}</p>}
            </div>
          </div>
          <div className="input_group_container" style={{ "position": "relative" }}>
            <div className="login--passcode">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  className="login--passcode-input"
                  value={digit}
                  onChange={(e) => handlePinChange(e, index)}
                  maxLength="1"
                />
              ))}
            </div>
            {errors.pin && <p className="error" style={{
              "position": "absolute",
              "left": 0,
              "bottom": -10
            }}>{errors.pin}</p>}
          </div>
          <button type="submit" className="base_btn btn_md primary_btn login--form-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <p className="login--terms">
          By continuing, I agree to the <span>Terms of Use</span> & <span>Privacy Policy</span>
        </p>
        <Link to="/" title="Contact Administrator" className="login--action">Contact Administrator</Link>
      </div>
    </div>
  );
};

export default Login;
