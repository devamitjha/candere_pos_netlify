import React from 'react';
import van from "../../assets/images/express-checkout.svg";
import './address.scss';

const AddressShip = () => {
  return (
    <div className='addressBox'>      
        <div className="addressBox--billing">
            <div className="addressBox--billing-text">
                <img src={van} alt="Express Checkout" className="img-fluid" />
                Bill To Same Address
            </div>
            <label className="checkbox--wrap"> Yes
                <input type="checkbox" className="custom-checkbox" />
                <span className="checkmark"></span>
            </label>
        </div>
    </div>
  )
}

export default AddressShip
