import React, { useState, useEffect } from 'react';
import cash from "../../assets/images/cash.svg";
import upi from "../../assets/images/upi.svg";
import { useSelector, useDispatch } from 'react-redux';
import { setPaymentMethodOnCart } from '../../services/SetPaymentMethodOnCart';
import { setDisabled, setCashMethod, cashPaymentPopup } from '../../redux/atcSlice'; 
import { toast } from 'react-toastify';
import './payment.scss';

const PaymentList = () => {
    const dispatch = useDispatch();
    const { quoteMask, disabled, setBillingShippingAddress, grandTotal, walletMethod } = useSelector((state) => state.atc);
    const { token } = useSelector((state) => state.user);
    const [selectedPayment, setSelectedPayment] = useState('');
    const methodActive = localStorage.getItem('methodActive') === 'true';  

    const cashPayment = async () => {
        const cartId = quoteMask; 
        const paymentCode = grandTotal > 0 ? 'checkmo' : 'mywallet';
        const authToken = token; 

        if (methodActive) {
            try {
                const result = await setPaymentMethodOnCart(cartId, paymentCode, authToken);
                console.log('Cash Payment method set successfully:', result);
                dispatch(setDisabled(false));
                dispatch(setCashMethod(true));
                localStorage.setItem('offline', true);
                setSelectedPayment('cash');
                dispatch(cashPaymentPopup(true));
            } catch (error) {
                console.error('Error setting payment method:', error);
            }
        } else {
            toast.warn("Please Select Shipping or Billing Address First", {
                theme: "colored",
                autoClose: 1500,
            });
            setSelectedPayment(''); // Reset selected payment
        }
    }

    const onlinePay = async () => {
        const cartId = quoteMask; 
        const paymentCode = 'juspay';
        const authToken = token;

        if (methodActive) {
            try {
                const result = await setPaymentMethodOnCart(cartId, paymentCode, authToken);
                console.log('Online Payment method set successfully:', result);
                dispatch(setDisabled(false));
                dispatch(setCashMethod(false));
                setSelectedPayment('online');
                localStorage.removeItem('offline');
            } catch (error) {
                console.error('Error setting payment method:', error);
            }
        } else {
            toast.warn("Please Select Shipping or Billing Address First", {
                theme: "colored",
                autoClose: 1500,
            });
            setSelectedPayment(''); // Reset selected payment
        }
    } 

    return (
        <>
            <div className={`paymentOptions ${methodActive? "paymentLoading" : ""}`}>
                <p className="paymentOptions-title">Select Payment Method</p>

                <div className="paymentOptions--wrapper">
                    <div className="paymentOptions--box" onClick={cashPayment}>
                        <div className="paymentOptions--box-left">
                            <div className="paymentOptions--box-icon">
                                <img src={cash} alt="Cash" className="img-fluid" />
                            </div>
                            <div className="paymentOptions--box-data">
                                <p className="paymentOptions--box-data-title">Cash</p>
                                <p className="paymentOptions--box-data-text">Pay Using Cash in Store</p>
                            </div>
                        </div>
                        <div className="paymentOptions--box-right">
                            <label className="radio--wrap">
                                <input type="radio" name="payment" className="custom-radio" 
                                    checked={selectedPayment === 'cash' && methodActive} />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                   {!walletMethod && <div className="paymentOptions--box" onClick={onlinePay}>
                        <div className="paymentOptions--box-left">
                            <div className="paymentOptions--box-icon">
                                <img src={upi} alt="UPI" className="img-fluid" />
                            </div>
                            <div className="paymentOptions--box-data">
                                <p className="paymentOptions--box-data-title">Online</p>
                                <p className="paymentOptions--box-data-text">Pay using apps like GPay, PhonePe or PayTM</p>
                            </div>
                        </div>
                        <div className="paymentOptions--box-right">
                            <label className="radio--wrap">
                                <input type="radio" name="payment" className="custom-radio" 
                                    checked={selectedPayment === 'online' && methodActive} />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div> }
                </div>
            </div>            
        </>
    );
}

export default PaymentList;
