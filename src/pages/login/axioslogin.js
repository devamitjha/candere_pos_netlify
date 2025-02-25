import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../../assets/images/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
import "./login.scss";
import { toast } from 'react-toastify';



// Function to validate agent code or phone
const validateAgentCodeOrPhone = (agentCodeOrPhone) => {
  const phoneRegex = /^[0-9]{10}$/; // Assuming 10-digit phone number

  return agentCodeOrPhone.length > 0 || phoneRegex.test(agentCodeOrPhone);
};

// Function to validate PIN
const validatePin = (pin) => {
  return pin.length === 6; // PIN should be 6 characters long
};

const Login = () => {
  const navigate = useNavigate();

  const [agentCodeOrPhone, setAgentCodeOrPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ agentCodeOrPhone: '', pin: '' });

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/categories');
    }
  }, [navigate]);

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
  
    setLoading(true);
  
    let data = JSON.stringify({
      "user_id": agentCodeOrPhone,
      "pass": pinCode // Assuming the PIN is used as the password
    });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://mcstaging.candere.com//api/V1/pos-agentmanagement/agentlogin',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
      },
      withCredentials: true,
      data: data
    };
  
    try {
      const response = await axios.request(config);
  
      if (response.data.success) {
        localStorage.setItem('isLoggedIn', true); // Set login status
        navigate('/categories');
      } else {
        alert('Invalid agent code or PIN');
      }
    } catch (error) {
      console.error('Error during validation:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (event, index) => {
    const { value } = event.target;
    if (/^[a-zA-Z0-9]?$/.test(value)) { // Allow alphanumeric characters
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
