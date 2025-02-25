import React from 'react';
import bag from '../../assets/images/checkoutBag.svg';
import card from '../../assets/images/checkoutCard.svg';
import './checkout.scss';


const Steps = () => {
  return (
    <div className="checkout--steps">
        <div className="checkout--steps-item">
            <img src={bag} alt="Checkout Bag" />
            Bag
        </div>
        <div className="checkout--steps-item">
            <img src={card} alt="Checkout Card" />
            Checkout
        </div>
    </div>
  )
}

export default Steps
