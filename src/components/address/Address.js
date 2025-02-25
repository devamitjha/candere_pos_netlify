import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import trash from "../../assets/images/trash.svg";
import edit from "../../assets/images/checkoutEdit.svg";
import './address.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setShippingAddress } from "../../services/SetShippingAddres";
import { setSelectedAddress, clearSelectedAddress } from '../../redux/selectedAddressSlice';
import { sheetClose } from '../../redux/bottomSheetSlice';  // Update with correct path
import { setShippingMethod } from '../../services/SetShippingMethod';
import { setBillingAddressOnCart } from '../../services/SetBillingAddress';
import {setBillingShipping} from '../../redux/atcSlice'; 


const Address = () => {
    const addresses = useSelector((state) => state.address.addresses);
    const { quoteMask } = useSelector((state) => state.atc);
    const { token, customer_id } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    let location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    
    const addressLists = addresses.addresses;

    // Retrieve selected address from localStorage on component mount
    const [selectedAddress, setSelectedAddressState] = useState(() => {
        const savedAddress = localStorage.getItem('selectedAddress');
        return savedAddress ? JSON.parse(savedAddress) : null;
    });

    useEffect(() => {       
        if (selectedAddress) {
          // Save the selected address and flag in localStorage
          localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
          localStorage.setItem('isSelectedAddress', 'true');
          
          // Dispatch the selected address to Redux to ensure it's in the global state
          dispatch(setSelectedAddress(selectedAddress));
        } else {
          // Optionally clear the selected address if none is present
          dispatch(clearSelectedAddress());
          localStorage.removeItem('isSelectedAddress');
        }
      }, [selectedAddress, dispatch]);

     

    const handleRadioChange = async (address) => {
        setSelectedAddressState(address);
        dispatch(setSelectedAddress(address));
        dispatch(sheetClose());
        try {
            const cartId = quoteMask; 

            const response = await setShippingAddress(cartId, token, address);
            const result = await setBillingAddressOnCart(cartId, token, address);

            const {carrier_code, method_code} = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods[0];

            const responseMethod = await setShippingMethod(customer_id, token, carrier_code || "freeshipping" , method_code || "freeshipping");

            const methodStatus = responseMethod.data.SetShippingMethodPos.status
            if(methodStatus==="success"){
                dispatch(setBillingShipping(true));
                localStorage.setItem("methodActive", true);
            }

            console.log("setBillingAddressOnCart");
            console.log(result);

        } catch (error) {
            console.error('Error setting shipping address:', error);
        }
    };

    const addressList = addressLists.map((item, index) => (
        <div key={index} className="addressBox--wrap">
            <div className="addressBox--body">
                <div className="addressBox--data">
                    <div className="addressBox--card">
                        <p className="addressBox--card-text">
                            {!isProfilePage ? "Deliver to:" : "Name:"}                             
                            <span>{item.firstname} {item.lastname}</span>
                        </p>
                        <div className="addressBox--card-address">                                
                            <p>{item.street.join(', ')}, {item.city}, {item.region.region}, {item.postcode}, {item.country_code}</p>
                        </div>
                        <p className="addressBox--card-text">Mobile: <span>{item.telephone}</span></p>
                    </div>
                </div>
            </div>
            <div className="addressBox--foot">
                <div className="addressBox--foot-action">
                    <div className="addressBox--foot-action-child">
                        <img src={trash} alt="Delete" className="img-fluid" />
                    </div>
                    <div className="addressBox--foot-action-child">
                        <img src={edit} alt="Edit" className="img-fluid" />
                    </div>
                </div>
                {!isProfilePage && (
                    <label className="radio--wrap">
                        Ship Here
                        <input 
                            type="radio" 
                            name="address" 
                            className="custom-radio" 
                            checked={selectedAddress === index} 
                            onChange={() => handleRadioChange(item)}
                        />
                        <span className="checkmark"></span>
                    </label>
                )}
            </div>
        </div>
    ));

    return (
        <div className="addressBox">
            {addressList}
        </div>
    );
};

export default Address;
