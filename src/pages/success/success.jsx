import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {clearCart, setDisabled, removeCartCount, setGT, cashPaymentPopup} from '../../redux/atcSlice'; 
import './success.scss';

const Success = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(''); 
  const [redirect, setRedirect] = useState(false);
  const { disabled, quoteMask, cartCount, grandTotal, showCashPaymentPopup, cashMethod } = useSelector((state) => state.atc); 
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');

  // Extract only the numeric part of the order_id
  const orderNumber = orderId ? orderId.split('_')[0] : null;

  // Function to send data to the API
  const sendOrderStatus = async (orderNumber, status) => {
    const data = JSON.stringify({
      query: `mutation updateOrderStatus($input: UpdateStatusInput!) {
        UpdateStatus(input: $input) {
          message
          status
        }
      }`,
      variables: {
        input: {
          order_id: orderNumber,
          status: status
        }
      }
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      const responseData = response.data;

      // Check the status field in the response to determine success or failure
      if (responseData?.data?.UpdateStatus?.status === 'success') {
        setResult('Success');
        localStorage.removeItem('offline');
        dispatch(cashPaymentPopup(false));
        dispatch(setDisabled(true)); 
        dispatch(removeCartCount());  
        localStorage.removeItem("storeBillingAddress");
        localStorage.removeItem("grandTotal");
        localStorage.removeItem("isSelectedAddress");
        localStorage.removeItem("methodActive");
      } else {
        setResult('Failure');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Failure');
    } finally {
      setLoading(false); // Turn off loading once the request is done
    }
  };

  // Call the function when the component mounts
  let offLine = localStorage.getItem('offline');
  useEffect(() => {    
    dispatch(clearCart());
    if (orderNumber && status) {
      sendOrderStatus(orderNumber, status);
    } else if(offLine){
      navigate('/success');
      localStorage.removeItem('offline');
    }else {
      // If no valid orderNumber or status, redirect to homepage
      setRedirect(true);
    }
  }, [orderNumber, status]);

  // Handle redirection based on redirect state
  useEffect(() => {
    if (redirect) {
      navigate('/');
    }
  }, [redirect, navigate]);

  // Display loading message
  if (loading) {
    return <div>Offline Payment Done</div>;
  }

  return (
    <div className='sePage'>
      <div className='sePage-box'>
        <h1 className='sePage-result'>Order {result}</h1>
        <p className='sePage-orderNumber'>Order Number: {orderNumber}</p>
        <p className='sePage-status'>Status: {status}</p>
      </div>
    </div>
  );
};

export default Success;
