import React, {useState} from 'react';
import Handler from '../handler/Handler';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {setDisabled, removeCartCount, setGT, cashPaymentPopup} from '../../redux/atcSlice'; 
import { useSelector, useDispatch } from 'react-redux';
import { createPosOrder } from '../../services/createPosOrder';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import CalculateValues from '../../components/orderSummary/CalculateValues';
import OrderSummary from '../../components/orderSummary/OrderSummary';
import { setCartItems, setLoading, setError } from '../../redux/cartItemSlice';
import { fetchCartData } from '../../services/fetchCartData';
import close from '../../assets/images/close.svg';
import "./footer.scss";

const Footer = () => {
  const dispatch = useDispatch();
  const { disabled, quoteMask, cartCount, grandTotal, showCashPaymentPopup, cashMethod } = useSelector((state) => state.atc); 
  const { isSheetId, isSheetOpen } = useSelector((state) => state.bottomSheet);
  const { email } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cartItems);
  const { orderTotal } = useSelector((state) => state.orderSummary);
  const {customer_id, token} = useSelector((state) => state.user);
  const {agentCodeOrPhone, storeCode} = useSelector((state) => state.agent);

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location; 

  let buttonText, buttonLink, buttonTitle, isDisabled ;
  
  // Set button text and links based on the current path
  if (pathname === '/checkout/cart') {
    buttonText = "Continue to Checkout";
    buttonLink = "/checkout/payment";
    buttonTitle = "Continue to Checkout";
  } else if (pathname === '/checkout/payment') {
    buttonText = `Place Order (₹${grandTotal})`;
    buttonLink = "/checkout/payment";
    buttonTitle = "Place Order (₹0)";
    isDisabled = disabled;
  } else {
    buttonText = "View Bag";
    buttonLink = "/checkout/cart";
    buttonTitle = "View Bag";
  }
  
  const [orderResponse, setOrderResponse] = useState(null);

  const handleCreatePosOrder = async () => {
    dispatch(setDisabled(false)); 
    try {
      const response = await createPosOrder(quoteMask);
      setOrderResponse(response); 
      console.log('Order response:', response);
      const juspayURL = response.data.CreatePosOrder.paymentLink;  
      if (juspayURL) {
        window.location.replace(juspayURL);
        dispatch(removeCartCount());
      }
    } catch (error) {
      console.error('Failed to create POS order:', error);
      dispatch(removeCartCount());
    } finally {
      dispatch(setDisabled(true)); // Hide loading state
      dispatch(removeCartCount());
    }
  };

  const handleCreatePosOrderCashMethod = async () =>{
    dispatch(setDisabled(false)); 
    try {
      const response = await createPosOrder(quoteMask);
      setOrderResponse(response); 
      const juspayURL = response.data.CreatePosOrder.paymentLink;  
      if (cashMethod) {
        console.log('Navigating to success page...');
        navigate(`success?order_id=${juspayURL}&status=success`, { replace: true });
      }        
    } catch (error) {
      console.error('Failed to create POS order:', error);
      dispatch(removeCartCount());
    } finally {
      dispatch(setDisabled(true)); // Hide loading state
      dispatch(removeCartCount());
    }
  };

  const setGrandTotal = ()=>{
    const gTotal = localStorage.getItem('grandTotal'); 
    //dispatch(setGT(gTotal));
    dispatch(setGT({ grandTotal: gTotal, walletMethod: false }));
  }


  // Load Initial Cart Item (for example purposes)
  const loadCartData = () => {
    cartCount > 0 ?  navigate('/checkout/cart') : navigate('/categories');
  };
  const segments = orderTotal ? CalculateValues(orderTotal) : [];
  const handleEditOrderClick = () => {
    dispatch(sheetClose());
    navigate('/checkout/cart');
  }

  // Load cartItem
  const loadCurrentCartData = async () => {    
    dispatch(setLoading(true));
    try {
      const cartData = await fetchCartData(customer_id, agentCodeOrPhone, storeCode);
      const responseData = cartData.data.data.CartDetail.productData; 
      if (responseData && responseData.length > 0) {       
        dispatch(setCartItems(responseData));
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

  const handleOrderSummary = ()=>{
    loadCurrentCartData();
    dispatch(sheetOpen('orderSummary'))
  }

  const handleHidePaymentModal = () => {
    dispatch(cashPaymentPopup(false));
    dispatch(setDisabled(true)); 
  }
  
  return (
    cartCount > 0 ? (
      <>
        <div className="fixedFooter">
          <div className="footerActions">          

            {/* Show appropriate button based on the path */}
            {pathname === '/checkout/cart' ? (
              <>
                <p className="footerActions--total footerActions--child base_btn btn_lg text_btn">
                  Total Products: <span className="badge">{cartCount}</span>
                </p>
                <Link 
                  to="/checkout/payment" 
                  className="footerActions--bag footerActions--child base_btn btn_lg primary_btn"
                  title={buttonTitle}
                  onClick={setGrandTotal}
                >
                  {buttonText}
                </Link>
              </>
            ) : pathname === '/checkout/payment' ? (
              <>
                <p className="footerActions--total footerActions--child base_btn btn_lg text_btn" onClick={handleOrderSummary}>
                Order Summary 
                <span className="badge payment">
                  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.55297 0.613144L0.432969 6.73314C-0.0870312 7.25314 -0.0870312 8.09314 0.432969 8.61314C0.952969 9.13314 1.79297 9.13314 2.31297 8.61314L7.49964 3.43981L12.673 8.61314C13.193 9.13314 14.033 9.13314 14.553 8.61314C15.073 8.09314 15.073 7.25314 14.553 6.73314L8.43297 0.613144C7.9263 0.0931445 7.07297 0.0931445 6.55297 0.613144Z" fill="#4E4B66"/>
                  </svg>
                </span>
                </p>
                <button disabled={isDisabled}
                  className={`footerActions--bag footerActions--child base_btn btn_lg primary_btn ${isDisabled ? 'disabled' : ''}`}
                  title={buttonTitle} onClick={handleCreatePosOrder}
                >
                  {buttonText}
                </button>
              </>
            ) : (
              <>
                <p className="footerActions--total footerActions--child base_btn btn_lg text_btn">
                Total Products: <span className="badge">{cartCount}</span>
                </p>
                <div 
                  className="footerActions--bag footerActions--child base_btn btn_lg primary_btn"
                  onClick={loadCartData}
                >
                  View Bag
                </div>
              </>
            )}
          </div>
          <Handler />
        </div>

        <BottomSheet
          open={isSheetId === "orderSummary" && isSheetOpen}
          onDismiss={() => dispatch(sheetClose())}
          defaultSnap={({ snapPoints, lastSnap }) =>
              lastSnap ?? Math.min(...snapPoints)
          }
          header={
              <div className='sheetHeader'>
                 <div className='sheet-userDetails'>
                    <p>Account</p>
                    <p>{email}</p>
                 </div>
              </div>
          }
        >
          <div className='sheetBody' style={{backgroundColor: "#F9F9F9", marginTop: "0"}}>
            <div className='sheet--orderTitle'>
              <p className='sheet--orderTitle-title'>Order Summary</p>
              <div className='sheet--orderTitle-action' onClick={handleEditOrderClick}>Edit Order</div>
            </div>
            <div className='pageInfo sheet--pageInfo'>
              <p className="pageInfo-title">No. of Products</p>
              <p className="pageInfo-count">{cartCount}</p>
            </div>
            <div className='sheet--card-wrapper'>
              {cartItems.map((item, index) => (
                <div className='sheet--card' key={index}>
                  <div className="sheet--card-left">
                    <div className='sheet--card-image'>
                      <img src={item.image} alt={item.name}  className='img-fluid' />
                    </div>
                  </div>
                  <div className="sheet--card-right">
                    <p className='sheet--card-title'>{item.name}</p>
                    <div className='sheet--card--details'>
                      <p className='sheet--card--details-qty'>Quantity: <span>{item.qty}</span></p>
                      <p className='sheet--card--details-price'>&#8377;{Math.trunc(item.price)}</p>
                    </div>
                  </div>
                </div>                
              ))}
            </div>
            <OrderSummary segments={segments} orderTotal={orderTotal} />
          </div>
        </BottomSheet>

          {showCashPaymentPopup && (
                <div className="modal-overlay">
                    <div className='modal-wrapper'>
                        <Handler />
                        <div className='modal-head'>
                            <div>Confirm Payment</div>
                            <div className='modal-close' onClick={handleHidePaymentModal}>
                                <img src={close} alt="Modal Close" className='img-fluid' />
                            </div>
                        </div>
                        <div className='modal-body'>
                            <div className="modal-content">
                                <p className='modal-content-info'>Payment Mode: Cash</p>
                                <p className='modal-content-info'>Payment Amount: &#8377;{grandTotal}</p>
                            </div>
                        </div>
                        <div className="modal-foot">
                            <div className='base_btn btn_md modal-foot-action secondary_btn' onClick={handleHidePaymentModal}>NO</div>
                            <div className='base_btn btn_md modal-foot-action primary_btn' onClick={handleCreatePosOrderCashMethod}>YES</div>
                        </div>
                    </div>
                </div>
            )}
      </>

    ) : null
  );
};

export default Footer;
