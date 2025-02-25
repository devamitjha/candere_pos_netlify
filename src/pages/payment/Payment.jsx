import React, { useState, useEffect } from 'react';
import Steps from '../../components/checkout/Steps';
import Pageinfo from '../../components/pageinfo/Pageinfo';
import Wallet from '../../components/wallet/Wallet';
import PaymentList from '../../components/payment/PaymentList';
import { useSelector, useDispatch } from 'react-redux';
import { setAddresses, setLoading, setError } from '../../redux/addressSlice'; 
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice'; 
import { cartSummary } from '../../services/CartSummary';
import { clearCart} from '../../redux/atcSlice';
import { setSelectedAddress } from '../../redux/selectedAddressSlice';
import { logoutUser } from '../../redux/userSlice'; 
import { toast } from 'react-toastify';
import axios from 'axios';

const Payment = () => {
  const dispatch = useDispatch();
  const { token, sessionId } = useSelector((state) => state.user);
  const [loadAddress, setLoadAddress] = useState(false);

  let data = JSON.stringify({
    query: `{
      customer {
        firstname
        lastname
        suffix
        email
        addresses {
          firstname
          lastname
          street
          city
          region {
            region_code
            region
            region_id
          }
          postcode
          country_code
          telephone
          default_billing
          default_shipping
          id
        }
      }
    }`,
    variables: {},
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/graphql',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: data,
  };

  const fetchShippingAddress = async () => {
    try {
      dispatch(setLoading()); // Set loading state
      const response = await axios.request(config);
      const addresses = response.data.data.customer;
      if (addresses) {
        setLoadAddress(true);
        dispatch(setAddresses(addresses)); // Dispatch the addresses to the store
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      dispatch(setError('Failed to fetch addresses')); // Set error state
    }
  };

  //loadCartSummary
    const localStorageCartCount = localStorage.getItem('loginCartCount');
    const getCartSummaryData = async () => {
      try {
        dispatch(setOrderSummaryLoading()); 
        const cartData = await cartSummary(token, sessionId); 
        dispatch(setOrderTotal(cartData)); 
      } catch (error) { 
        if(error.response.status == 404){
          dispatch(clearCart());
          dispatch(setSelectedAddress(null));
          console.error('Error fetching cart summary:', error);
          dispatch(setOrderSummaryError('Error fetching cart summary'));         
          localStorage.removeItem('isSelectedAddress');
          localStorage.removeItem('loginCartCount');
          localStorage.removeItem('isSelectedAddress');
          localStorage.removeItem('methodActive');
          localStorage.removeItem('userBillingAddress');
        }
        if(error.response.status == 401){
          dispatch(logoutUser());
          dispatch(clearCart());
          dispatch(setSelectedAddress(null));
          dispatch(setOrderSummaryError('Error fetching cart summary')); 
          toast.error("Please Login Again");
          localStorage.removeItem('isSelectedAddress');
          localStorage.removeItem('loginCartCount');
          localStorage.removeItem('methodActive');
          localStorage.removeItem('userBillingAddress');
        }
      }
    }
    useEffect(() => {
      if (localStorageCartCount) {
        getCartSummaryData();
      }
    }, [localStorageCartCount]);


  useEffect(() => {
    if (token) {
      fetchShippingAddress();
    }
  }, [token]);

  const renderContent = () => {
    return loadAddress ? (
      <Pageinfo title="Deliver Product to Customer" />
    ) : (
      <div style={{"height" : "45px", "display": "flex", "justifyContent": "center", "alignItems": "center"}}>Addres Is Loading...</div>
    );
  };

  return (
    <div className="checkoutPage">
      <div className="checkout">
        <Steps />
        <div className="checkout--bleedingSpace">
          {renderContent()}
          <Wallet />
          <PaymentList />
        </div>
      </div>
    </div>
  );
};

export default Payment;
