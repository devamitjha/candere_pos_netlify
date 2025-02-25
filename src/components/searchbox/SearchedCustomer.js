import React from 'react';
import { Link } from 'react-router-dom';
import close from '../../assets/images/cardClose.svg';
import "./searchbox.scss";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlice'; 
import { clearCart } from '../../redux/atcSlice';
import { setSelectedAddress } from '../../redux/selectedAddressSlice';
import { useNavigate } from 'react-router-dom';


const SearchedCustomer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const nameParts = (user.userName).split(' ');
    const initials = nameParts[0][0] + nameParts[1][0];

    const handleLogout = () => {       
        dispatch(logoutUser());
        dispatch(clearCart());
        dispatch(setSelectedAddress(null));
        localStorage.removeItem('isSelectedAddress');
        navigate('/');
    };


  return (
    <div className="searchBox--card">
        <div className="searchBox--card-left">
            <div className="searchBox--card-image">{initials}</div>
        </div>
        <div className="searchBox--card-center">
            <div className="searchBox--card-data">
                <p className="searchBox--card-data-name">{user.userName}</p>
                <ul className="searchBox--card-data-lists">
                    <li className="searchBox--card-data-item">{user.email}</li>
                    <li className="searchBox--card-data-item">{user.phone}</li>
                </ul>
                <Link to="/profile" title="View Profile" className="searchBox--card-data-action">
                    View Profile 
                </Link>
            </div>
        </div>
        <div className="searchBox--card-right">
            <img src={close} alt="Close" className="img-fluid" onClick={handleLogout}/>
        </div>
    </div>
  )
}

export default SearchedCustomer
