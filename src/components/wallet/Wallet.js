import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './wallet.scss';
import {setGT} from '../../redux/atcSlice'; 
import { cartSummary } from '../../services/CartSummary';
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice';

const Wallet = () => {
  const dispatch = useDispatch();
  const { customer_id, token } = useSelector((state) => state.user);
  const [walletAmount, setWalletAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {grandTotal, walletMethod, quoteId } = useSelector((state) => state.atc); 
  const [promoWalletAmount, setPromoWalletAmount] = useState();

  // Fetch Wallet Amount
  const fetchWalletAmount = async () => {
    try {
      const data = JSON.stringify({
        query: `query FetchWalletAmount($input: FetchWalletAmountInput!) {
          FetchWalletAmount(input: $input) {
            walletamount
            status
            message
          }
        }`,
        variables: { input: { customer_id } }
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: data
      };

      const response = await axios.request(config);
      const fetchedWalletAmount = response.data.data.FetchWalletAmount.walletamount;      
      setWalletAmount(fetchedWalletAmount);
      setLoading(false);

    } catch (error) {
      console.error("Failed to fetch wallet amount:", error);
      setError("Failed to fetch wallet amount");
      setLoading(false);
    }
  };

  const handleApplyCandereWallet = async () => {

    let availableAmount = Math.trunc(walletAmount || 0);
    if (availableAmount > grandTotal) {
      const remainingAmount = availableAmount - grandTotal;       
      setWalletAmount(remainingAmount);
    }else{
      setWalletAmount(0);
    }
    try {
      const data = JSON.stringify({
        query: `mutation ApplyWallet($input: ApplyWalletInput!) {
          ApplyWallet(input: $input) {
            message
          }
        }`,
        variables: {
          input: {
            type: "wallet",
            customer_id, 
            amount: availableAmount.toString(), 
            grand_total_amount: grandTotal.toString(),
          }
        }
      });
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        data: data
      };
      const response = await axios.request(config);
      const message = response.data.data.ApplyWallet.message.toString();
      console.log("response*********amount")
      console.log(response)

      if(response.status==200){
        const newGT = response.data.data.ApplyWallet.message.toString();
        dispatch(setGT({ grandTotal: grandTotal - newGT, walletMethod: true }));
        console.log("response*********amount2")
        console.log(grandTotal - newGT)
        toast.success(`Applied wallet amount: ₹${Math.trunc(newGT)}.`);
      }

    } catch (error) {
      console.error("Failed to apply wallet amount:", error);
      toast.error("Failed to apply wallet amount.");
    }
  };
  //promowallet Apply
  const fetchPromoWallet = async () => {
    const data = JSON.stringify({
      query: `query PromoWalletBalance($input: PromoWalletBalanceInput!) 
              {
                PromoWalletBalance(input: $input) {
                  walletamount
                  status
                  message
                }
              }`,
      variables: { "input": { "customer_id": customer_id } },
    });
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    try {
      const response = await axios.request(config);
      console.log("***promowallet amount****");
      console.log(JSON.stringify(response.data));
      const promoWalletBalance = response.data.data.FetchWalletAmount.walletamount;
      console.log(promoWalletBalance);
      setPromoWalletAmount(promoWalletBalance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWalletAmount();
    fetchPromoWallet();
  }, []);

  //cart summary
  const getCartSummary = async () => {
    try {
      dispatch(setOrderSummaryLoading());
      const cartData = await cartSummary(token);
      dispatch(setOrderTotal(cartData));
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      dispatch(setOrderSummaryError('Error fetching cart summary')); // Handle errors
    }
  };

  const applyPromoWallet= async () => {
    const data = JSON.stringify({
      query: `mutation ApplyPromo($input: ApplyPromoInput!) {
        ApplyPromo(input: $input) {
            message
            status
        }
      }`,
      variables: { "input": { "cart_id": quoteId, "customer_id": customer_id } },
    });
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    try {
      const response = await axios.request(config);
      console.log("applyiiiiiiiing************");
      console.log(JSON.stringify(response.data));
      const ApplyPromo = response.data.data.ApplyPromo.message;
      if(ApplyPromo==="ALREADY APPLIED"){
        toast.warn(ApplyPromo);
      }else{
        getCartSummary();
        toast.success(ApplyPromo);
      }
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wallet">
      <p className="wallet-title">Wallets</p>
      <div className="wallet--wrapper">
        <div className="wallet--card candere">
          <p className="wallet--card-head">Candere Wallet</p>
          <div className="wallet--card-body">
            <div className="wallet--card-data">
              <p className="wallet--card-data-text">Eligible Balance</p>
              {loading ? (
                <p className="wallet--card-data-amount">Loading...</p>
              ) : error ? (
                <p className="wallet--card-data-amount">{error}</p>
              ) : (
                <p className="wallet--card-data-amount">&#8377;{Math.trunc(walletAmount || 0)}</p>
              )}
            </div>
          </div>
          <div title="Apply" className="wallet--card-action" onClick={handleApplyCandereWallet}>Apply</div>
        </div>
        <div className="wallet--card promo">
          <p className="wallet--card-head">Promo Wallet</p>
          <div className="wallet--card-body">
            <div className="wallet--card-data">
              <p className="wallet--card-data-text">Eligible Balance</p>
              <p className="wallet--card-data-amount">&#8377;{Math.trunc(promoWalletAmount || 0)}</p>
            </div>
          </div>
          <div title="Apply" className="wallet--card-action" onClick={applyPromoWallet}>Apply</div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
