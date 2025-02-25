import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import info from '../../assets/images/info_outlined.svg';
import check from '../../assets/images/check.svg';
import './checkout.scss';
import { toggleCheckbox, applyInsurance } from '../../redux/insuranceSlice';
import { toast } from 'react-toastify';
import { cartSummary } from '../../services/CartSummary';

const Insurance = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const {sessionId} = useSelector((state) => state.user);
    const isChecked = useSelector((state) => state.insurance.isChecked);

    // Handle checkbox change
    const handleCheckboxChange = () => {
        const newCheckedState = !isChecked;
        dispatch(toggleCheckbox()); // Update Redux state
        triggerInsuranceApply(newCheckedState); // Trigger the insurance apply function
    };

    // Function to trigger the insurance apply mutation
    const triggerInsuranceApply = async (checked) => {
        try {
            await applyInsurance(user.customer_id, checked);
        } catch (error) {
            console.error('Failed to apply insurance:', error);
            toast.error('Failed to apply insurance.');
        }
    };

    // Effect to handle page load and apply insurance based on initial state
    useEffect(() => {
        triggerInsuranceApply(isChecked);
        //getCartSummary()
    }, [isChecked]);

    const getCartSummary = async () => {
        try {
          const cartData = await cartSummary(user.token, sessionId);
          console.log("cartData-2");
        } catch (error) {
          console.error('Error fetching cart summary:', error);
        }
      };

    return (
        <div className="insuranceBox">
            <div className="insuranceBox--head">
                <div className="insuranceBox--head-wrap">
                    <p className="insuranceBox--head-wrap-text">Include Insurance for your Jewellery</p>
                    <img src={info} alt="Info" className="img-fluid" />
                </div>
                <label className="checkbox--wrap">
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                </label>
            </div>
            {
                isChecked ? (
                    <>
                        <div className="insuranceBox--body">
                            <div className="insuranceBox--body-left">
                                <p className="insuranceBox--body-text">
                                    <img src={check} alt="1 Year Coverage" />
                                    1 Year Coverage
                                </p>
                                <p className="insuranceBox--body-text">
                                    <img src={check} alt="Easy Claim" />
                                    Easy Claim
                                </p>
                            </div>
                            <div className="insuranceBox--body-right">
                                <p className="insuranceBox--body-price">&#8377;99</p>
                            </div>
                        </div>
                        <div className="insuranceBox--footer">
                            <p className="insuranceBox--footer-text">Insurance Applies post Delivery, Candere takes responsibility for Jewellery during transit</p>
                        </div>
                    </>
                ) : (
                    <div className="has_insurance_msg">Protect your precious jewellery post-delivery with Insurance.</div>
                )
            }
        </div>
    );
};

export default Insurance;
