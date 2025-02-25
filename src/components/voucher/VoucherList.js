import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import './Voucher.scss';

const VoucherList = ({ applyCoupon, removeCoupon }) => { 
    const { vouchers, status, error } = useSelector((state) => state.vouchers);
    const { orderTotal } = useSelector((state) => state.orderSummary);
    const { customer_id } = useSelector((state) => state.user);

    // Memoize the list of applied coupons
    const appliedCouponList = useMemo(() => {
        return orderTotal.coupon_code ? orderTotal.coupon_code.split(',').map(item => item.trim()) : [];
    }, [orderTotal.coupon_code]);

    return (
        <div className='voucher-listing'>
            <p className='voucher-applyTitle'>Apply any one coupon from below</p>
            {status === 'failed' && <p className='voucher-error'>Error: {error}</p>}
            {status === 'loading' ? (
                <p className='voucher-loading'>Loading vouchers...</p>
            ) : (
                <ul className='voucher-lists'>
                    {vouchers.map((voucher) => (
                        <li key={voucher.coupon} className='voucher--item'>
                            <div className='voucher--item--content'>
                                <p className="voucher--item--content-title">{voucher.coupon}</p>
                                <p className="voucher--item--content-subTitle">{voucher.name}</p>
                            </div>
                            {appliedCouponList.length > 0 ? (
                                <div className='voucher--item-action base_btn btn_md' onClick={() => removeCoupon(voucher.coupon)}>Remove</div>
                            ) : (
                                <div className='voucher--item-action base_btn btn_md' onClick={() => applyCoupon(customer_id, voucher.coupon)}>Apply</div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default VoucherList;
