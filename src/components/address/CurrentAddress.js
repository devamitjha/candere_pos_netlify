import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './address.scss';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice'; 
import { selectSelectedAddress, setSelectedAddress } from '../../redux/selectedAddressSlice'; 
import { setShippingAddress } from "../../services/SetShippingAddres";
import { setShippingMethod } from '../../services/SetShippingMethod';
import { setBillingAddressOnCart } from '../../services/SetBillingAddress';
import { setBillingShipping } from '../../redux/atcSlice'; 
import AddNewAddress from './AddNewAddress';

const CurrentAddress = () => {
    const dispatch = useDispatch();
    const [showAddress, setShowAddress] = useState(false);
    const { quoteMask } = useSelector((state) => state.atc);
    const { token, customer_id } = useSelector((state) => state.user);
    
    // Fetch addresses
    const addresses = useSelector((state) => state.address.addresses);
    const addressLists = addresses?.addresses || []; 
    console.log(addressLists);

    // Find default shipping address
    const newAddress = addressLists.find(addressList => addressList.default_shipping === true);
    const selectedAddress = useSelector(selectSelectedAddress) || newAddress;

    // Handle address change
    const changeAddress = () => {
        dispatch(sheetOpen('addAddress'));
    };

    // Handle shipping address change and method setting
    const handleRadioChange = async (address) => {
        dispatch(setSelectedAddress(address));        
        try {
            const cartId = quoteMask;
            const response = await setShippingAddress(cartId, token, address);
            const result = await setBillingAddressOnCart(cartId, token, address);

            const { carrier_code, method_code } = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods[0];
            const responseMethod = await setShippingMethod(customer_id, token, carrier_code || "freeshipping", method_code || "freeshipping");

            if (responseMethod.data.SetShippingMethodPos.status === "success") {
                dispatch(setBillingShipping(true));
                localStorage.setItem("methodActive", true);
                localStorage.removeItem("storeBillingAddress");
                localStorage.setItem("userBillingAddress", JSON.stringify(address));
            }

            console.log("Billing address set successfully:", result);

        } catch (error) {
            console.error('Error setting shipping address:', error);
        }
    };

    // Initialize radioActive state based on localStorage
    const [radioActive, setRadioActive] = useState(false);

    useEffect(() => {
        const savedAddress = localStorage.getItem('userBillingAddress');
        if (savedAddress) {
            setRadioActive(true);
        }
    }, [selectedAddress]);

    const addNewUserAddress = ()=>{
        setShowAddress(true);
        dispatch(sheetOpen());
    }

    return (
   
        <div className="addressBox">
            {
            selectedAddress ?            
            <div className="addressBox--wrap">
                <div className="addressBox--body">
                    <div className="addressBox--data">
                        <div className="addressBox--card">
                            <p className="addressBox--card-text">
                                Deliver to:
                                <span>{selectedAddress.firstname} {selectedAddress.lastname}</span>
                            </p>
                            <div className="addressBox--card-address">                                
                                <p>{selectedAddress.street.join(', ')}, {selectedAddress.city}, {selectedAddress.region.region}, {selectedAddress.postcode}, {selectedAddress.country_code}</p>
                            </div>
                            <p className="addressBox--card-text">Mobile: <span>{selectedAddress.telephone}</span></p>
                        </div>
                    </div>
                </div>
                <div className="addressBox--foot">
                    <div className="addressBox--foot-action" onClick={changeAddress}>
                        Change Address
                    </div>
                    <label className="radio--wrap">
                        Ship Here
                        <input 
                            type="radio" 
                            name="currentAddress" 
                            className="custom-radio" 
                            checked={radioActive}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleRadioChange(selectedAddress);
                                    setRadioActive(true);
                                }
                            }} 
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
            :<>
                <p onClick={addNewUserAddress}>Add Address</p>
                {showAddress && <AddNewAddress />}
            </>
            }
        </div>
    );
};

export default CurrentAddress;
