import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Steps from '../../components/checkout/Steps';
import Pageinfo from '../../components/pageinfo/Pageinfo';
import CheckoutCard from '../../components/checkout/CheckoutCard';
import CalculateValues from '../../components/orderSummary/CalculateValues';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import Voucher from '../../components/voucher/Voucher';
import { setCartItems, setLoading, setError } from '../../redux/cartItemSlice';
import { cartSummary } from '../../services/CartSummary';
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice'; // Import the actions
import { logoutUser } from '../../redux/userSlice'; 
import { clearCart, addQuoteId, grandTotal, cashPaymentPopup } from '../../redux/atcSlice';
import { setSelectedAddress } from '../../redux/selectedAddressSlice';
import { toast } from 'react-toastify';
import { fetchCartData } from '../../services/fetchCartData';



const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, loading, error } = useSelector((state) => state.cartItems);
  const { orderTotal } = useSelector((state) => state.orderSummary);
  const {customer_id, token, sessionId} = useSelector((state) => state.user);
  const {agentCodeOrPhone, storeCode} = useSelector((state) => state.agent);
  const {cartCount} = useSelector((state) => state.atc);
  const localStorageCartCount = localStorage.getItem('loginCartCount');

  const loadCartData = async () => {    
    dispatch(setLoading(true));
    try {
      const cartData = await fetchCartData(customer_id, agentCodeOrPhone, storeCode);
      const resData = cartData.data.data.CartDetail;
      const responseData = cartData.data.data.CartDetail.productData; 
      if (responseData && responseData.length > 0) {
        const maskId = resData.quote_mask_id;
        const quoteId = resData.quote_id;
        localStorage.setItem('quoteMask', maskId);
        localStorage.setItem('quoteId', quoteId);  
        dispatch(setCartItems(responseData));
        dispatch(addQuoteId(quoteId));
        console.log("Load cart Data");
        console.log(cartData);
      } else {
        console.error('No cart data received');
      }
    }catch (error) {
      dispatch(setError('Error fetching cart data'));
      dispatch(setLoading(false));
    }
    finally {
      dispatch(setLoading(false));
    }    
  };

  useEffect(() => {
    console.log("pageload");
    dispatch(cashPaymentPopup(false)); 
    localStorage.removeItem('methodActive');
    localStorage.removeItem('userBillingAddress')
    localStorage.removeItem("storeBillingAddress");
    localStorage.removeItem('selectedAddress');
    localStorage.removeItem('isSelectedAddress');
      loadCartData();
      getCartSummary();
  }, [token, cartCount]);


  const getCartSummary = async () => {
    try {
      dispatch(setOrderSummaryLoading()); 
      const cartData = await cartSummary(token, sessionId); 
      dispatch(setOrderTotal(cartData)); 
      console.log("get cart summary");
      console.log(cartData);
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
  };

  const segments = orderTotal ? CalculateValues(orderTotal) : [];
  const loadingCartCount = parseInt(localStorageCartCount, 10); 

  if (loading && loadingCartCount > 0) {
    return (
      <div className="checkout--bleedingSpace">
        <div className="checkout--list"> 
          {/* Repeat the skeleton UI cartCount number of times */}
          {[...Array(loadingCartCount)].map((_, index) => (
            <div key={index} className="row_group cart_Page_item_wrapper cart noItem" style={{"position":"relative", "marginTop": "34px"}}>
              <div className="ph-avatar posAbs"></div>
              <div className="ph-item alignItemCenter">
                <div className="ph-col-3">
                  <div className="ph-picture"></div>
                </div>
                <div>
                  <div className="ph-row">
                    <div className="ph-col-8"></div>
                    <div className="ph-col-4 empty"></div>

                    <div className="ph-col-6"></div>
                    <div className="ph-col-6 empty"></div>

                    <div className="ph-col-4"></div>
                    <div className="ph-col-8 empty"></div>  
                  </div>
                </div>
              </div>
              <div className="ph-row">
                <div className="ph-col-4 empty big"></div>
                <div className="ph-col-4"></div>
                <div className="ph-col-4 empty big"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className="checkoutPage">
      {cartItems.length > 0 && orderTotal? (
        <div className='checkout'>
          <Steps/>
          <div className="checkout--bleedingSpace">
            <Pageinfo title="Total Item(s)" count={cartCount || "0"} />

            <div className="checkout--list">           
              { cartItems.map((item, index) => (
                    <CheckoutCard key={index} cartItem={item} />
                  ))    
                }       
            </div>
            <Voucher />
            <OrderSummary segments={segments} orderTotal={orderTotal} cartCount={localStorageCartCount}/>
          </div>
        </div>
      ) : (
        <p className="checkout--empty">Your cart is empty</p>
      )}
      
    </div>
  )
}

export default Cart
