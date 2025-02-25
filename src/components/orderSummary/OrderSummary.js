import React from 'react';
import Handler from '../handler/Handler';
import { useLocation } from 'react-router-dom';

const OrderSummary = ({ segments, orderTotal, cartCount }) => {
    const location = useLocation();
    const { pathname } = location; 
    const subtotalSegment = segments.find(segment => segment.title === "Item total");
    const discountSegment = segments.find(segment => segment.title === `Discount (${orderTotal.coupon_code})`);
    const shippingSegment = segments.find(segment => segment.title === `Shipping & Handling`);
    const insuranceSegment = segments.find(segment => segment.title === `Insurance`);
    const promoWallet = segments.find(segment => segment.title === `Promo Wallet`);
    const grandtotalSegment = segments.find(segment => segment.title === `Grand Total`);
    return (
        <div className="orderSummary">
            <p className="orderSummary--text">Order Summary:</p>
            <div className="orderSummary--wrap">
                <Handler />
                <div className="orderSummary--box">
                    <div className="table-responsive">
                        <table className="summaryTable">
                            <thead>
                                <tr>
                                    <th>No. of Products</th>
                                    <th>{cartCount}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subtotalSegment && (
                                    <tr>
                                        <td>{subtotalSegment.title}</td>
                                        <td>&#8377;{subtotalSegment.value}</td>
                                    </tr>
                                )}
                                {discountSegment && (
                                    <tr>
                                        <td>{discountSegment.title}</td>
                                        <td className="success">&#8377;{discountSegment.value}</td>
                                    </tr>
                                )}                                                              
                                {promoWallet && (
                                    <tr>
                                        <td>{promoWallet.title}</td>
                                        <td className="success">&#8377;-{promoWallet.value}</td>
                                    </tr>
                                )}
                                {shippingSegment && (
                                    <tr>
                                        <td>{shippingSegment.title}</td>
                                        <td>{shippingSegment.value}</td>
                                    </tr>
                                )}
                                {grandtotalSegment && (                                    
                                    <tr className="grandTotal">
                                        <td>{grandtotalSegment.title}</td>
                                        {
                                            promoWallet ?  <td>&#8377;{Math.trunc(grandtotalSegment.value - (promoWallet.value))}</td> : <td>&#8377;{Math.trunc(grandtotalSegment.value)}</td>
                                        }
                                        
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary
