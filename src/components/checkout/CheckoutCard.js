import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import trash from '../../assets/images/trash.svg';
import eye from '../../assets/images/checkoutEye.svg';
import remove from '../../assets/images/remove.svg';
import close from "../../assets/images/close.svg";
import { BottomSheet } from 'react-spring-bottom-sheet';
import './checkout.scss';
import 'react-spring-bottom-sheet/dist/style.css';
import SectionTitle from '../sectionTitle/SectionTitle';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {setCartCount, deleteProduct } from '../../redux/atcSlice'; 
import {removeCartItem} from '../../redux/cartItemSlice'; 
import { cartSummary } from '../../services/CartSummary';
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice'; // Import the actions

const CheckoutCard = ({cartItem, product_data}) => {    
    const dispatch = useDispatch(); 
    let actualPrice = ((cartItem.price * cartItem.qty) - (cartItem.discount_amount));
    let crossPrice = (cartItem.price * cartItem.qty);
    const quantities = cartItem.all_qty.split(',').map((qty) => qty.trim());
    const { quoteId, quoteMask, cartCount } = useSelector((state) => state.atc);
    const user = useSelector((state) => state.user);
    const {sessionId} = useSelector((state) => state.user);

    // const {cartItems} = useSelector((state) => state.cartItems);

    // Details in bottomsheet
    const buyRequest = JSON.parse(cartItem.info_buyRequest);

    //sizes
    const sizesData = JSON.parse(cartItem.all_sizes);
    const sizeID = cartItem.size_id;

    //bottomsheet
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [deleteDeta, setDeleteDeta] = useState(false);

    const viewDetailBottomSheet = useCallback(() => {
        setIsSheetOpen(true);        
    }, []);

    const handleCloseSheet = useCallback(() => {
        setIsSheetOpen(false);
    }, []);

    // const deleteStateCartData = (product_id)=>{
    //     dispatch(removeCartItem({ product_id: product_id }));
    // }
    // Delete Item
    const deleteCurrentCartItem = async (product_id) => {   
        setDeleteDeta(true);
        try {
          // Create the request payload
          let data = JSON.stringify({
            query: `mutation DeleteItemFromCart($input: DeleteItemDataInput!) {
              DeleteItemData(input: $input) {
                status
                message
              }
            }`,
            variables: { "input": { "cart_id":quoteId, "cart_item_id": product_id } }
          });
      
          // Configure the request
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/graphql',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
            },
            data: data
          };
      
          // Make the API request using await
          const response = await axios.request(config);
          console.log(response);
      
          // Log the response data
          const successMsg = response.data.data.DeleteItemData.status;          
          if(successMsg==='success'){
            setDeleteDeta(false);
            if (cartCount > 0) {
                dispatch(setCartCount(cartCount - 1));
            } else {
                dispatch(setCartCount(0)); // If cartCount is already 0 or less, reset it to 0
            }
            dispatch(removeCartItem({ product_id: product_id }));
            getCartSummary()
          }


        } catch (error) {
          // Handle any errors
          if (error.response) {
            console.log("Error Response Data: ", error.response.data);
            console.log("Error Status: ", error.response.status);
          } else {
            console.log("Error: ", error.message);
          }
        }
      };

      const getCartSummary = async () => {
        try {
          dispatch(setOrderSummaryLoading()); // Set loading before fetching data
          const cartData = await cartSummary(user.token, sessionId); // Fetch cart summary data
          dispatch(setOrderTotal(cartData)); // Dispatch the cart summary data to Redux store
        } catch (error) {
          console.error('Error fetching cart summary:', error);
          dispatch(setOrderSummaryError('Error fetching cart summary')); // Handle errors
        }
      };
      
  return (
    <>
        <div className="checkout--card">
            <div title="Delete" className="checkout--card-delete" 
             onClick={() => { deleteCurrentCartItem(cartItem.quote_item);}} test={cartItem.quote_item}>
                <img src={trash} alt="Delete" className="img-fluid" />
            </div>
            {
                deleteDeta && (
                    <div className="removing-item">
                         <img src={remove} alt="Delete" className="img-fluid" />
                    </div>
                )
            }
            <div className="checkout--card-body">
                <div className="checkout--card-body-left">
                    <Link to="/" title="Product Name" className="checkout--card-image">
                        <img src={cartItem.image} alt="Product Name" className="img-fluid" />
                    </Link>
                </div>
                <div className="checkout--card-body-right">
                    <div className="">
                        <p className="checkout--card-name">{cartItem.name}</p>
                        <div className="checkout--card-sizes">
                            {sizeID && sizesData[sizeID] && (
                                <div className="checkout--card-sizes-list">
                                    Size:                           
                                    <p key={sizeID} value={sizeID}>
                                        {sizesData[sizeID]}
                                    </p>
                                </div>
                            )}
                            <div className="checkout--card-sizes-list">
                                Qty:
                                <select id={`quantity-${cartItem.product_id}`} defaultValue={cartItem.qty} className="checkout--card-sizes-list-options" disabled>
                                    {quantities.map((qty, index) => (
                                        <option key={index} value={qty}>
                                            {qty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="checkout--card-price">
                            <p className="checkout--card-price-new">&#8377;{Math.trunc(actualPrice)}</p>
                            <p className="checkout--card-price-old">&#8377;{Math.trunc(crossPrice)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkout--card-footer">
                <div className="checkout--card-action">
                    <div className="checkout--card-action-btn" onClick={viewDetailBottomSheet}>
                        <img src={eye} alt="View Details" className="img-fluid" />
                        View Details
                    </div>
                </div>
            </div>
        </div>
        <BottomSheet
            open={isSheetOpen}
            onDismiss={handleCloseSheet}
            defaultSnap={({ snapPoints, lastSnap }) =>
                lastSnap ?? Math.min(...snapPoints)
            }
            snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 2,
                maxHeight * 0.7,
            ]}
            header={
                <div className='sheetHeader'>
                    <SectionTitle title="View Details" />
                    <div className='sheetHeader--close' onClick={handleCloseSheet}>
                        <img src={close} alt='BottomSheet Close' className='img-fluid' />
                    </div>
                </div>
            }
        >
            <div className='sheetBody' style={{ marginTop: 0 }}>
                <div className='filter'>
                    <div className='filter--card'>
                        <div className='filter--card-image'>
                            <img src={cartItem.image} alt={cartItem.name} className="img-fluid" />
                        </div>
                        <div className='filter--card--data'>
                            <p className="filter--card--data-name">{cartItem.name}</p>
                            <div className="filter--card--data-price">
                                <p className="filter--card--data-price-new">&#8377;{Math.trunc(actualPrice)}</p>
                                <p className="filter--card--data-price-old">&#8377;{Math.trunc(crossPrice)}</p>
                            </div>
                        </div>
                    </div>

                    <p className='filter-title'>Product Details</p>
                    <div className='filter--details'>
                        <div className='filter--details--item'>
                            <p className='filter--details--item-text'>Metal Purity / Color / Weight (Approx.)</p>
                            <p className='filter--details--item-data'>{buyRequest.metal}</p>
                        </div>
                        {
                            buyRequest.clarity.length > 0 &&    
                            <>
                                <div className='filter--details--item'>
                                    <p className='filter--details--item-text'>Diamond Clarity</p>
                                    <p className='filter--details--item-data'>{buyRequest.clarity}</p>
                                </div>
                            
                                <div className='filter--details--item'>
                                    <p className='filter--details--item-text'>Diamond Weight</p>
                                    <p className='filter--details--item-data'>{buyRequest.stone_weight}</p>
                                </div>
                            </>        
                        }
                    </div>
                </div>
            </div>
        </BottomSheet>
    </>
  )
}

export default CheckoutCard
