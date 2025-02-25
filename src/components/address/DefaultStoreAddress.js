import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './address.scss';
import { selectSelectedAddress, setSelectedAddress, clearSelectedAddress } from '../../redux/selectedAddressSlice'; 
import { setShippingAddress } from "../../services/SetShippingAddres";
import { setShippingMethod } from '../../services/SetShippingMethod';
import { setBillingAddressOnCart } from '../../services/SetBillingAddress';
import { setBillingShipping } from '../../redux/atcSlice'; 

const CurrentAddress = () => {
    const dispatch = useDispatch();
    const { storeAddress, storePinCode, storeName, city, region, region_id, country_code } = useSelector((state) => state.agent);
    const { token, customer_id, phone } = useSelector((state) => state.user);
    const { quoteMask } = useSelector((state) => state.atc);

    const customerFirstName = localStorage.getItem("customerFirstName");
    const customerLastName = localStorage.getItem("customerLastName");

    const savedAddress = localStorage.getItem('selectedAddress');
    const [radioActive, setRadioActive] = useState(false);

    const address = {
        firstname: customerFirstName,
        lastname: customerLastName,
        company: "",
        street: [storeAddress],
        city: city,
        region: region,
        region_id: region_id,
        postcode: storePinCode,
        country_code: country_code,
        telephone: phone,
        save_in_address_book: false,
    };

    const handleRadioChange = async (address) => {
        setRadioActive(true); 
        dispatch(clearSelectedAddress());
       // dispatch(setSelectedAddress(address));

        try {
            const cartId = quoteMask;
            const response = await setShippingAddress(cartId, token, address);
            const result = await setBillingAddressOnCart(cartId, token, address);

            const { carrier_code, method_code } = response.data.setShippingAddressesOnCart.cart.shipping_addresses[0].available_shipping_methods[0];

            const responseMethod = await setShippingMethod(customer_id, token, carrier_code || "freeshipping", method_code || "freeshipping");

            const methodStatus = responseMethod.data.SetShippingMethodPos.status;
            if (methodStatus === "success") {
                dispatch(setBillingShipping(true));
                localStorage.setItem("methodActive", true);
                localStorage.setItem("storeBillingAddress", true);
                localStorage.removeItem("userBillingAddress");
            }

            console.log("setBillingAddressOnCart");
            console.log(result);

        } catch (error) {
            console.error('Error setting shipping address:', error);
        }
    };

    useEffect(() => {
        const storedBillingAddress = localStorage.getItem('storeBillingAddress');
        if (storedBillingAddress) {
            setRadioActive(true);
        }
    }, []);

    return (
        <div className="addressBox">
            <div className="addressBox--wrap">
                <div className="addressBox--body">
                    <div className="addressBox--data">
                        <div className="addressBox--card">
                            <p className="addressBox--card-text">
                                Deliver to:                            
                                <span>{storeName}</span>
                            </p>
                            <div className="addressBox--card-address">                                
                                <p>{storeAddress}</p>
                            </div>
                            <p className="addressBox--card-text">Pincode: <span>{storePinCode}</span></p>
                        </div>
                    </div>
                </div>
                <div className="addressBox--foot">
                    <label className="radio--wrap">
                       Ship Here
                        <input 
                            type="radio" 
                            name="storeAddress" 
                            className="custom-radio" 
                            checked={radioActive} 
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleRadioChange(address);
                                }
                            }} 
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CurrentAddress;
