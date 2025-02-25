import React, {useState} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import { BottomSheet } from 'react-spring-bottom-sheet';
import SectionTitle from '../sectionTitle/SectionTitle';
import VoucherList from './VoucherList';
import check from '../../assets/images/check.svg';
import trash from '../../assets/images/trash.svg';
import close from '../../assets/images/close.svg';
import { setVouchers, setLoading, setError } from '../../redux/voucherSlice';
import { cartSummary } from '../../services/CartSummary';
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice'; // Import the 
import './Voucher.scss';

const Voucher = () => {
    const dispatch = useDispatch();
    const {isSheetOpen, isSheetId} = useSelector((state) => state.bottomSheet);
    const { customer_id, token } = useSelector((state) => state.user);
    const { agentCodeOrPhone, storeCode } = useSelector((state) => state.agent);
    const { orderTotal } = useSelector((state) => state.orderSummary);
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState('');

    const applyCoupon = async (customer_id, couponCode) => {
        let data = JSON.stringify({
            query: `mutation applyCouponPos {
            applyCouponPos(
              input: {
                customer_id: "${customer_id}",
                coupon_code: "${couponCode}",
              }
            ) {
              message
              status
            }
          }`,
            variables: {}
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
            const { status, message } = response.data.data.applyCouponPos;
            
            if (status === 'APPLIED_COUPON_SUCCESS') {
                setMessage(`Success: ${couponCode}`);
                dispatch(sheetClose())
                getCartSummary();
            } else {
                setMessage(`Error: ${message}`);
                setTimeout(() => setMessage(''), 8000); 
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setTimeout(() => setMessage(''), 8000); 
        }
    };    

    //fetching coupon list
    const fetchVouchers = async () => {
        dispatch(setLoading());
        let data = JSON.stringify({
            query: `query {
                CouponListPos(input: {
                customer_id: "${customer_id}",
                agentCode: "${agentCodeOrPhone}",
                storeCode: "${storeCode}",
                }) {
                    name
                    description
                    coupon
                    valid
                    validMessage
                    visible_frontend
                    priority
                }
            }`,
            variables: {}
            });
        
            let config = {
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
                dispatch(setVouchers(response.data.data.CouponListPos));
            } catch (error) {
                dispatch(setError(error.message));
            }        
    }

    const handlerVoucherOffers = () => {
        dispatch(sheetOpen('offerList'));
        fetchVouchers();
    }

    //Delete coupon
    const deleteActiveCoupon = async (item) => {
        let data = JSON.stringify({
            query: `mutation {
            DeleteCouponPos(
              input: {
                customer_id: "${customer_id}"
                coupon: "${item}"
              }
            ) {
              status
              message
              statusCode
            }
          }`,
            variables: {}
          });          
        
            let config = {
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
                const deletedResponse = response.data.data.DeleteCouponPos.status==="success";
                if(deletedResponse){
                    getCartSummary();
                    dispatch(sheetClose())
                }
            } catch (error) {
                dispatch(setError(error.message));
            }        
    }

    const getCartSummary = async () => {
        try {
          dispatch(setOrderSummaryLoading());
          const cartData = await cartSummary(token);
          dispatch(setOrderTotal(cartData));
        } catch (error) {
          console.error('Error fetching cart summary:', error);
          dispatch(setOrderSummaryError('Error fetching cart summary'));
        }
    };

    const removeCoupon = (item)=>{
        deleteActiveCoupon(item);   
    }


  return (
    <>
        <div className='voucher'>
            <div className='voucher--top voucher--child'>
                <div className='voucher--child-left'>
                    <p className='voucher-title'>Apply Offer / Voucher</p>
                </div>
                <div className='voucher--child-right'>
                    <p className='voucher-offers' onClick={handlerVoucherOffers}>Check Offers</p>
                </div>
            </div>
            {(orderTotal.coupon_code || message) && (
                <div className='voucher--bottom voucher--child'>
                    <div className='voucher--child-left'>
                        <p className='voucher-message'>
                            <img src={check} alt="Check" />
                            {orderTotal.coupon_code ? `Success: ${orderTotal.coupon_code}` : message}
                        </p>                    
                    </div>
                    <div className='voucher--child-right'>
                        <div className='voucher-delete' onClick={() => removeCoupon(orderTotal.coupon_code)}>
                            <img src={trash} alt="Trash" />
                        </div>
                    </div>
                </div>
            )}
            
        </div>

        <BottomSheet
            open={isSheetId === "offerList" && isSheetOpen}
            onDismiss={() => dispatch(sheetClose())}
            defaultSnap={({ snapPoints, lastSnap }) =>
                lastSnap ?? Math.min(...snapPoints)
            }
            header={
                <div className='sheetHeader'>
                    <SectionTitle title="Apply Offer" />
                    <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                        <img src={close} alt='BottomSheet Close' className='img-fluid' />
                    </div>
                </div>
            }
        >
            <div className='sheetBody'>
                <div className='voucher--manual'>
                    <div className="input_group_container">
                        <div className="input_group_">
                            <input className="input_type_text" type="text" placeholder="Enter Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                        </div>
                        <button className='base_btn btn_lg primary_btn' onClick={() => applyCoupon(customer_id, couponCode)}>Apply</button>
                    </div>
                    {message === "SUCCESS" ? (
                        <p className='voucher-message success'>
                            {message}
                        </p>
                    ) : (
                        <p className='voucher-message error'>
                            {message}
                        </p>
                    )}
                </div>
                <div className="voucher-divider">OR</div>
                <VoucherList applyCoupon={applyCoupon} removeCoupon={removeCoupon}/>
            </div>
        </BottomSheet>
    </>
  )
}

export default Voucher
