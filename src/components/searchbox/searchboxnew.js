import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import search from "../../assets/images/search.svg";
import camera from "../../assets/images/camera.svg";
import close from "../../assets/images/close.svg";
import SectionTitle from '../sectionTitle/SectionTitle';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import './searchbox.scss';
import 'react-spring-bottom-sheet/dist/style.css';
import { customerData } from '../../api/customerData';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../../redux/userSlice';
import SearchedCustomer from "./SearchedCustomer"

const Searchbox = () => {
    const agent = useSelector((state) => state.agent);
    const user = useSelector((state) => state.user);

    const { isUser, userName } = useSelector((state) => state.user);

    const productLists = useSelector((state) => state.products.items);    
    const dispatch = useDispatch();
    const isSheetOpen = useSelector((state) => state.bottomSheet.isSheetOpen);
    const isSheetId = useSelector((state) => state.bottomSheet.isSheetId);
    const [searchProduct, setSearchProduct] = useState('');
   
    const [searchCustomer, setsearchCustomer] = useState('');
    const [customerData, setCustomerData] = useState([]);


     
    // Fetch customer data from the API
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (searchCustomer.trim().length === 10) {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `/api/V1/customers/search?searchCriteria[filterGroups][0][filters][0][field]=phone&searchCriteria[filterGroups][0][filters][0][value]=%25${searchCustomer}%25&searchCriteria[filterGroups][0][filters][0][condition_type]=like&searchCriteria[pageSize]=5`,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta'
                    },
                };
    
                try {
                    const response = await axios.request(config);
                    let customerInfo = response.data.items;
    
                    // If the response contains a single item as an object, convert it to an array
                    if (!Array.isArray(customerInfo)) {
                        customerInfo = [customerInfo];
                    }
    
                    setCustomerData(customerInfo);
                } catch (error) {
                    console.error(error);
                }
            } else {
                // Clear customer data if input is less than 10 characters
                setCustomerData([]);
            }
        };
    
        fetchCustomerData();
    }, [searchCustomer]);
    
    // Filter customers based on search input
    const filteredCustomers = useMemo(() => {
        if (searchCustomer.trim().length !== 10) return [];
    
        // Filter by checking the phone number in each customer's custom_attributes
        return customerData.filter((customer) => {
            const phoneAttribute = customer.custom_attributes.find(attr => attr.attribute_code === 'phone');
            return phoneAttribute && phoneAttribute.value.includes(searchCustomer);
        });
    }, [searchCustomer, customerData]);

    //if User will be selected then 
   

    const filteredProducts = useMemo(() => {
        if (searchProduct.trim() === '') return [];
        return productLists.filter((item) =>
            item.name && item.name.toLowerCase().includes(searchProduct.toLowerCase())
        );
    }, [searchProduct]);

    //send and verify OTP

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [errors, setErrors] = useState({ email: '', mobile: '', otp: '' });
    const [verified, setVerified] = useState(false);
    const [customerOTP, setCustomerOTP] = useState('');
    const [reqId, setReqId] = useState('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidMobileNumber = (number) => /^\d{10}$/.test(number);

    const validateForm = () => {
        let emailError = '';
        let mobileError = '';

        // Email validation
        if (!emailRegex.test(email)) {
            emailError = 'Invalid email format';
        }

        // Mobile number validation
        if (!isValidMobileNumber(mobileNumber)) {
            mobileError = 'Mobile number must be 10 digits';
        }

        setErrors({ email: emailError, mobile: mobileError });

        return !emailError && !mobileError;
    };

    //verify email
    const verifyEmail = async () => {
        try {
          let data = JSON.stringify({
            "firstname": fullName,
            "email": email,
            "phone": mobileNumber,
            "agentCode":agent.agentCodeOrPhone,
            "storeCode":agent.storeCode
          });
      
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/V1/pos-customermanagement/checkcustomer',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta', 
            },
            data: data
          };
      
          const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        if(response.data.status==="error"){
            toast.error(response.data.msg, {
                    position: "bottom-center",
                    autoClose: 2000,
                    closeOnClick: true,
                    theme: "colored",
                });
        }
          if (response.data.status === 'success') {
            console.log("step-1");
            //sendOtp();
            handleOtpSend(fullName, email, mobileNumber);
          }

        } catch (error) {
          console.log(error);
        }
    };

    const handleOtpSend = async (fullName, email, mobileNumber) => {
        setFullName(fullName);
        setEmail(email);
        setMobileNumber(mobileNumber);
    
        if (filteredCustomers.length > 0) {    
            alert(mobileNumber);     
            await sendOtp(mobileNumber);
        } else {           
            if (!validateForm()) {
                console.log("Form validation failed");
                return; 
            }
            await sendOtp(mobileNumber);
        }
    };

    //send OTP
    const sendOtp = async (mobileNumber) => {       
       // if (!validateForm()) return;

        const url = 'https://api.msg91.com/api/v5/widget/sendOtp';
        const headers = {
            'tokenAuth': '384989Ts7IMlC35Q6500443fP1',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const data = {
            tokenAuth: '384989Ts7IMlC35Q6500443fP1',
            widgetId: '33696c704173393935363533',
            identifier: "91" + mobileNumber,
        };

        try {
            const response = await axios.post(url, data, { headers });
            console.log('OTP sent successfully:', response.data);

            if (response.data.type === 'success') {
                setVerified(true);
                setReqId(response.data.message);

                // Close "Send OTP" BottomSheet and open "Verify OTP"
                dispatch(sheetClose());
                dispatch(sheetOpen('verifyOtp'));
                console.log("step-2");
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };
    //verify OTP
    const verifyOtp = async () => {
        if (!customerOTP) {
            setErrors((prevErrors) => ({ ...prevErrors, otp: 'OTP cannot be blank' }));
            return;
        }

        const url = 'https://api.msg91.com/api/v5/widget/verifyOtp';
        const headers = {
            'tokenAuth': '384989Ts7IMlC35Q6500443fP1',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const data = {
            tokenAuth: '384989Ts7IMlC35Q6500443fP1',
            otp: customerOTP,
            widgetId: '33696c704173393935363533',
            reqId: reqId,
        };

        try {
            const response = await axios.post(url, data, { headers });
            console.log('OTP verified successfully:', response.data);
            console.log("step-3");
            registerCustomer();
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    //function Register Customer
    const registerCustomer = async () => {
        try {
          let data = JSON.stringify({
            "name": fullName,
            "email": email,
            "phone": mobileNumber,
            "agentCode": agent.agentCodeOrPhone,
            "storeCode": agent.storeCode
          });
      
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/V1/pos-customermanagement/registerSignup',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta', 
            },
            data: data
          };
      
          const response = await axios.request(config); 
      
          if (response.data.status === 'success') {
            const userData = response.data;
            console.log(userData);
            // Dispatch to Redux
            dispatch(setUser({
                customer_id:userData.customer_id,
                userName:fullName,
                email:email,
                phone: mobileNumber,
            }));

            dispatch(sheetClose());
            
            // Save to localStorage for persistence
            localStorage.setItem('userData', JSON.stringify({
                customer_id:userData.customer_id,
                userName:fullName,
                email:email,
                phone: mobileNumber,
            }));
          }
          
          console.log(JSON.stringify(response.data));
      
        } catch (error) {
          console.log(error); 
        }
      };
      
      

    return (
        <>
           <div className="searchBox">
                         
                <div className="searchBox--item">
                    <div className="searchBox--action">
                        <p className="searchBox--action-title">Customer Details</p>
                        { isUser ? <Link to="/profile" className="searchBox--action-link"> Edit Customer</Link> :
                        <p className="searchBox--action-link" title="Add Customer" onClick={() => dispatch(sheetOpen('addCustomer'))}>Add Customer</p>
                        }
                    </div>
                    { isUser ? <SearchedCustomer/> :
                        <div className="searchBox--input">
                            <div className="input_group_container">
                                <div className="input_group_">
                                    <input
                                        className="input_type_text"
                                        type="text"
                                        placeholder="Search Name / Contact No / Email ID"
                                        value={searchCustomer}
                                        onChange={(e) => setsearchCustomer(e.target.value)}
                                    />
                                    <div className="searchBox--input-icon" title="Search">
                                        <img src={search} alt="Search" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {filteredCustomers.length > 0 && (
                        <div className="searchResults-wrapper">
                            {filteredCustomers.map((customer) => {
                                const phoneAttribute = customer.custom_attributes.find(attr => attr.attribute_code === 'phone');
                                const fullName = `${customer.firstname} ${customer.lastname}`;
                                const phone = phoneAttribute ? phoneAttribute.value : 'Phone not available';

                                return (
                                    <div className="searchResults" key={customer.id}>
                                        <div className='searchResults-left'>
                                            <div className="userData">
                                                <p className='userData-text'>{fullName}</p>
                                                <p className='userData-text'>{phone}</p>
                                                <p className='userData-text'>{customer.email}</p>
                                            </div>
                                        </div>
                                        <div className='searchResults-right'>
                                            <p 
                                                alt="Select Customer" 
                                                className="searchResults-action editCustomer" 
                                                onClick={() => handleOtpSend(fullName, customer.email, phone)}
                                            >
                                                Select Customer
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            <div className="searchBox--item">
                <div className="searchBox--action">
                    <p className="searchBox--action-title">Add Product</p>
                    <a href="/" className="searchBox--action-link" title="Report Issue" style={{display: 'none'}}>Report Issue</a>
                </div>
                <div className="searchBox--input">
                    <div className="input_group_container">
                        <div className="input_group_">
                            <input
                                className="input_type_text"
                                type="text"
                                placeholder="Search Product Name / SKU Number"
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                            />
                            <div className="searchBox--input-icon" title="Search" style={{display: 'none'}}>
                                {/* <img src={camera} alt="Search" className="img-fluid" /> */}
                            </div>
                        </div>
                    </div>
                </div>
                {filteredProducts.length > 0 && (
                    <div className="searchResults-wrapper">
                        {filteredProducts.map((product) => (
                            <div className="searchResults" key={product.id}>
                                <div className='searchResults-left'>
                                    <div className="filter">
                                        <div className="filter--card">
                                            <div className="filter--card-image">
                                                <img src={product.image[0].metal_image} alt="Product Name" className="img-fluid" />
                                            </div>
                                            <div className="filter--card--data">
                                                <p className="filter--card--data-name">{product.name}</p>
                                                <div className="filter--card--data-price">
                                                    <p className="filter--card--data-price-new">₹35,416</p>
                                                    <p className="filter--card--data-price-old">₹44,270</p>
                                                </div>
                                                <p className="filter--card--data-offer">35% OFF on Making</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="searchResults-action addProduct">Add Product</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
            <BottomSheet
                open={isSheetId === "addCustomer" && isSheetOpen}
                onDismiss={() => dispatch(sheetClose())}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                header={
                    <div className='sheetHeader'>
                        <SectionTitle title="Add Customer" />
                        <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                            <img src={close} alt='BottomSheet Close' className='img-fluid' />
                        </div>
                    </div>
                }
            >
                <div className='sheetBody'>
                    <form className='sheetBody--form' onSubmit={(e) => e.preventDefault()}>
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input
                                    className="input_type_text"
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <div className="label_ pushedUp">Full Name</div>
                            </div>
                        </div>
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input
                                    className="input_type_text"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="label_ pushedUp">Email</div>
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>
                        </div>
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input
                                    className="input_type_text"
                                    type="text"
                                    placeholder="Mobile Number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                                <div className="label_ pushedUp">Mobile Number</div>
                                {errors.mobile && <div className="error">{errors.mobile}</div>}
                            </div>
                        </div>
                        <div className='base_btn btn_lg primary_btn' onClick={verifyEmail}>Send OTP</div>
                    </form>
                </div>
            </BottomSheet>

            {/* Verify OTP BottomSheet */}
            {verified && (
                <BottomSheet
                    open={isSheetId === "verifyOtp" && isSheetOpen}
                    onDismiss={() => dispatch(sheetClose())}
                    defaultSnap={({ snapPoints, lastSnap }) =>
                        lastSnap ?? Math.min(...snapPoints)
                    }
                    header={
                        <div className='sheetHeader'>
                            <SectionTitle title="OTP Verification" />
                            <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                                <img src={close} alt='BottomSheet Close' className='img-fluid' />
                            </div>
                        </div>
                    }
                >
                    <div className='sheetBody'>
                        <form className='sheetBody--form' onSubmit={(e) => e.preventDefault()}>
                            <div className="input_group_container">
                                <div className="input_group_">
                                    <input
                                        className="input_type_text"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={customerOTP}
                                        onChange={(e) => setCustomerOTP(e.target.value)}
                                    />
                                    <div className="label_ pushedUp">Enter OTP</div>
                                    {errors.otp && <div className="error">{errors.otp}</div>}
                                </div>
                            </div>
                            <div className='base_btn btn_lg primary_btn' onClick={verifyOtp}>Verify OTP</div>
                        </form>
                    </div>
                </BottomSheet>
            )}
        </>
    );
};

export default Searchbox;
