import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import fullLogo from "../../assets/images/full-logo.svg";
import headerCheckoutBag from "../../assets/images/headerCheckoutBag.svg";
import hamburger from "../../assets/images/hamburger.svg";
import headerStore from "../../assets/images/headerStore.svg";
import arrow from "../../assets/images/arrow.svg";
import close from "../../assets/images/close.svg";
import person from "../../assets/images/person_add.svg";
import { toggleMenu, menuClose } from '../../redux/menuSlice';
import { logout } from '../../redux/agentSlice';
import { logoutUser } from '../../redux/userSlice'; 
import { clearCart } from '../../redux/atcSlice';
import { setSelectedAddress, clearSelectedAddress, setCheckboxChecked } from '../../redux/selectedAddressSlice';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import { clearCustomerAddressData} from '../../redux/customerAddressSlice';
import SectionTitle from '../sectionTitle/SectionTitle';
import StoreAddress from '../storeAddress/StoreAddress';
// import { toggleBox } from '../../redux/customerSearchBoxSlice';
import { cartSummary } from '../../services/CartSummary';
import { setOrderTotal, setError as setOrderSummaryError, setLoading as setOrderSummaryLoading } from '../../redux/orderSummarySlice';
import "./header.scss";

const Header = () => {
    const location = useLocation();
    const { pathname } = location; 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const {nearbyStores} = useSelector((state) => state.nearbyStores);
    const selectedStore = useSelector((state) => state.nearbyStore.selectedStore);
    const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);
    const {cartCount, cartItems} = useSelector((state) => state.atc);
    const {storeName} = useSelector((state) => state.agent);
    const {isSheetOpen, isSheetId} = useSelector((state) => state.bottomSheet);
    const user = useSelector((state) => state.user);
    const {sessionId} = useSelector((state) => state.user);
    // console.log('Current cartCount:', cartCount);
    // console.log(user);

    const nameParts = (user.userName).split(' ');
    const initials = nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : null;
    

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('agentData'); 
        localStorage.removeItem('isSelectedAddress');
        localStorage.removeItem('CustomerAddressData');
        localStorage.removeItem('grandTotal');
        localStorage.removeItem('CustomerAddressData');
        localStorage.removeItem('selectedAddress');
        localStorage.removeItem('isSelectedAddress');
        localStorage.removeItem('updateProfile');
        dispatch(clearCustomerAddressData());
        dispatch(menuClose());
        dispatch(logout());
        //user
        dispatch(logoutUser());
        dispatch(clearCart());
        dispatch(setSelectedAddress(null));
        dispatch(clearSelectedAddress());
        dispatch(setCheckboxChecked(true));
        navigate('/');
    };

    const handleSearchSheet = () => {
        dispatch(sheetOpen('customerSearchBox'));
    }

    const handleFetchStore = () => {
        dispatch(sheetOpen('fetchStore'))
    }

    const refreshCartCount =  async () => {
        try {
            dispatch(setOrderSummaryLoading());
            const cartData = await cartSummary(user.token, sessionId);
            dispatch(setOrderTotal(cartData)); 
          } catch (error) {
            console.error('Error fetching cart summary:', error);
            dispatch(setOrderSummaryError('Error fetching cart summary'));
          }
    }

    return (
        <>
            <header className="header">
                <div className="header--wrapper">
                    <div className="header--left">
                        <div className="header--redirect">
                            <div title="Menu" className="header--redirect-menu" onClick={() => dispatch(toggleMenu())}>
                                <img src={hamburger} alt="Menu" className="img-fluid" />
                            </div>
                            <Link to="/" title="Candere - A Kalyan Kewellers Company" className="header--redirect-link">
                                <img src={fullLogo} alt="Candere - A Kalyan Kewellers Company" className="img-fluid" />
                            </Link>
                        </div>
                    </div>
                    <div className="header--right">
                        <div className="header--action">
                            <div className="header--action-child header--action-store" onClick={handleFetchStore}>
                                <img src={headerStore} alt="Store" className="img-fluid header--action-store-icon"/>
                                <p className="header--action-store-name">{selectedStore ? selectedStore.name : `${storeName}`}</p>
                            </div>

                            {
                                pathname !== '/checkout/payment' && 
                                <Link to="checkout/cart" title="Checkout" className="header--action-child header--action-link" onClick={refreshCartCount}>
                                    <img src={headerCheckoutBag} alt="Checkout" className="img-fluid" />                               
                                    <span className='header--action-badge'> {cartCount || "0"}</span>
                                </Link>
                            }                            

                            {initials ? (
                                <Link to='/profile' title='Profile' className='header--action-initials'>{initials}</Link>
                                ) : (
                                    <div className='header--action-child header--action-customer' onClick={handleSearchSheet} >
                                        <img src={person} alt="Customer" className='img-fluid' />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </header>
            {isMenuOpen && (
                <div className="menu">
                    <div className="menu--options">
                        <div className="menu--item">
                            <div className="menu--item-left">
                                <p className='menu--item-title'>Menu</p>
                            </div>
                            <div className="menu--item-right">
                                <img src={close} alt="Menu Close" className='img-fluid' onClick={() => dispatch(menuClose())} />
                            </div>
                        </div>
                        <div className="menu--item">
                            <div className="menu--item-left">
                                <Link to="checkout/cart" onClick={() => dispatch(menuClose())} title='Order History' className='menu--item-text'>Order History</Link>
                            </div>
                            <div className="menu--item-right">
                                <Link to="checkout/cart" onClick={() => dispatch(menuClose())} title='Order History' className='menu--item-text'>
                                    <img src={arrow} alt="Next" className='img-fluid' />
                                </Link>
                            </div>
                        </div>
                        <div className="menu--item logout">
                            <div className="menu--item-left">
                                <p className='menu--item-text' onClick={handleLogout}>Logout</p>
                            </div>
                            <div className="menu--item-right">
                                <div title="Agent Logout" className="menu--item-action" onClick={handleLogout}>
                                    System Logout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <BottomSheet
                open={isSheetId === "fetchStore" && isSheetOpen}
                onDismiss={() => dispatch(sheetClose())}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                header={
                    <div className='sheetHeader'>
                        <SectionTitle title="Nearest Stores" />
                        <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                            <img src={close} alt='BottomSheet Close' className='img-fluid' />
                        </div>
                    </div>
                }
            >
                <div className='sheetBody' style={{padding: 0}}>
                    <StoreAddress />
                </div>
            </BottomSheet>
        </>
    );
};

export default Header;
