import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import search from "../../assets/images/search.svg";
import remove from "../../assets/images/remove.svg"
import close from "../../assets/images/close.svg";
import SectionTitle from '../sectionTitle/SectionTitle';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import './searchbox.scss';
import 'react-spring-bottom-sheet/dist/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addProductSuccess, addProductFailure, setCartCount, cashPaymentPopup } from '../../redux/atcSlice';
import { setUser } from '../../redux/userSlice';
import SearchedCustomer from "./SearchedCustomer";
import { cartSummary } from '../../services/CartSummary';
import { customerAccountData } from '../../services/CustomerAccountData';
import BarcodeScanner from "../barcode/Barcode";
import { fetchProducts } from '../../redux/searchSlice';
import { fetchBarcodeProductsFailure, barcodeSet } from '../../redux/barcodeSlice';
import Filter from '../filter/Filter';
import { setAddresses} from '../../redux/addressSlice'; 
import { setCustomerAddressData, setLoading, setError } from '../../redux/customerAddressSlice'; // Import actions



const Searchbox = () => {
    const dispatch = useDispatch();
    const agent = useSelector((state) => state.agent);
    const { isUser, customer_id, sessionId} = useSelector((state) => state.user);
    const { token: isUserToken } = useSelector((state) => state.user);

    // const isBoxOpen = useSelector((state) => state.customerSearchBox.isBoxOpen);
    const {barcodeData } = useSelector((state) => state.barcode); 

    const isSheetOpen = useSelector((state) => state.bottomSheet.isSheetOpen);
    const isSheetId = useSelector((state) => state.bottomSheet.isSheetId); 
   
    const [searchCustomer, setsearchCustomer] = useState('');
    const [customerData, setCustomerData] = useState([]);
    const [loadingCustomer, setLoadingCustomer] = useState(false);

    //after verifying user email id
    const [userMobile, setUserMobile] = useState();
    const [userFullName, setUserFullName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userId, setuserId] = useState();    
    const [session_id, setSession_id] = useState();    
     
    //Customer Search
    useEffect(() => {
        const fetchCustomerData = async () => {
          if (searchCustomer.trim().length === 10) {
            setLoadingCustomer(true); 
    
            const data = JSON.stringify({
              query: `{
                searchCustomer(
                  phone: "${searchCustomer}"
                  agentCode:"${agent.agentCodeOrPhone}"
                  storeCode:"${agent.storeCode}"
                ) {
                  status 
                  statusCode
                  message
                  customersData { 
                    id 
                    email 
                    firstname 
                    lastname 
                    phone 
                  }
                }
              }`,
              variables: {} 
            });
    
            const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: '/graphql',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
              },
              data: data
            };
    
            try {
              const response = await axios.request(config);
              const customerInfo = response.data.data.searchCustomer.customersData || [];  
              console.log(customerInfo);
              let statusCode =response.data.data.searchCustomer.statusCode;
              if(statusCode==="NOCUSTOMERS"){
                toast.error(response.data.data.searchCustomer.message, {
                    position: "top-right",
                    autoClose: 2000,
                    closeOnClick: true,
                    theme: "colored",
                });
              } 
              setCustomerData(customerInfo);
            } catch (error) {
              console.error('Error fetching customer data:', error);
            } finally {
              setLoadingCustomer(false);
            }
          } else {
            setCustomerData([]);
          }
        };
    
        fetchCustomerData();
      }, [searchCustomer]);

    // Filter customers based on search input
    const filteredCustomers = useMemo(() => {
        if (searchCustomer.trim().length !== 10) return [];
        return customerData.filter((customer) => customer.phone.includes(searchCustomer));
    }, [searchCustomer, customerData]);

    //send and verify OTP
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState({ email: '', mobile: '', otp: '' });
    const [verified, setVerified] = useState(false);
    const [customerOTP, setCustomerOTP] = useState('');
    const [reqId, setReqId] = useState('');
    //const [userId, setUserId] = useState('')
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidMobileNumber = (number) => /^\d{10}$/.test(number);

    //form Validation when user input the field
    const validateForm = () => {
        let emailError = '';
        let mobileError = '';

        // Email validation
        if (!emailRegex.test(email)) {
            emailError = 'Invalid email format';
        }

        // Mobile number validation
        if (!isValidMobileNumber(mobileNumber.replace(/^\+91/, ""))) {
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
            "phone": mobileNumber.replace(/^\+91/, ""),
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
            sendOtp();
          }

        } catch (error) {
          console.log(error);
        }
    };

    //send OTP
    const sendOtp = async () => {  
       // if (userMobile && !validateForm()) return;  
        if (!userMobile && !validateForm()) {
            return;
        }

        const url = 'https://api.msg91.com/api/v5/widget/sendOtp';
        const headers = {
            'tokenAuth': '384989Ts7IMlC35Q6500443fP1',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const data = {
            tokenAuth: '384989Ts7IMlC35Q6500443fP1',
            widgetId: '33696c704173393935363533',
            identifier: "91" + (mobileNumber.replace(/^\+91/, "") || userMobile.replace(/^\+91/, "")),
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

    //cart summary 
    const getCartSummary = async () => {
        try {          
          const cartData = await cartSummary(token, sessionId);
          dispatch(setCartCount(cartData.items_qty)); 
        } catch (error) {         
          console.error('Error fetching cart summary:', error);
        }
      };   
    
    //get Customer Data
    const getCustomerAddress = async () => {
        dispatch(setLoading());
        try {          
          const response = await customerAccountData(token, userId);
          //dispatch(setAddresses(response.shipping_addresses)) 
          console.log("response.shipping_addresses")
          console.log(response)
          dispatch(setCustomerAddressData({
            customerInfo: {
              id: response.customerData.id,
              name: response.customerData.name,
              email: response.customerData.email,
              phone: response.customerData.phone,
            },
            addresses: response.customerData.shipping_addresses
          }));
        } catch (error) {         
            dispatch(setError(error.message));
        }
      }; 

    //verify OTP
    const verifyOtp = async () => {
        //when costomer login
        setsearchCustomer('');
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
            if(response.data.type==="success"){
                if(userMobile){               
                    dispatch(setUser({
                        customer_id:userId,
                        userName:userFullName,
                        email:userEmail,
                        phone: userMobile.replace(/^\+91/, ""),
                        token: token,
                        sessionId:session_id
                    }));
        
                    dispatch(sheetClose());
                    getCartSummary();
                    getCustomerAddress();
                   // setsearchCustomer();
                    
                    // Save to localStorage for persistence
                    localStorage.setItem('userData', JSON.stringify({
                        customer_id:userId,
                        userName:userFullName,
                        email:userEmail,
                        phone: userMobile.replace(/^\+91/, ""),
                        token: token,
                        sessionId:session_id
                    }));
                }else(
                    registerCustomer()
                )
            }else{
                alert("invalid OTP")
            }
            
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
                "phone": mobileNumber.replace(/^\+91/, ""),
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
                dispatch(setUser({
                    customer_id:userData.customer_id,
                    userName:fullName,
                    email:email,
                    phone: mobileNumber.replace(/^\+91/, ""),
                    sessionId:session_id
                }));
                dispatch(sheetClose());            
                // Save to localStorage for persistence
                localStorage.setItem('userData', JSON.stringify({
                    customer_id:userData.customer_id,
                    userName:fullName,
                    email:email,
                    phone: mobileNumber.replace(/^\+91/, ""),
                    sessionId:session_id
                }));
            }        
        } catch (error) {
            console.log(error); 
        }
    };    

    // Login customer 
    const [sendingOTP, setSendingOTP] = useState("Select Customer");
    const loginVerify = async (phone, fullName, customerEmail, customerID) => {
        setSendingOTP("Sending OTP... Please Wait");
        let data = JSON.stringify({
            "emailPhone": phone,
            "storeCode": agent.storeCode, 
            "agentCode":agent.agentCodeOrPhone,
        });
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/V1/pos-customermanagement/verifyemail',
            headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
            },
            data: data
        };
        
        try {
            const response = await axios.request(config);
            const successData = response.data.statusCode;          
            console.log("loginverify");
            console.log(response);
            if(successData == "VALIDMOBILE"){     
            setUserMobile(phone);
            setUserFullName(fullName);
            setUserEmail(customerEmail);
            setuserId(customerID); 
            setSession_id(response.data.session_id); 
            setToken(response.data.customer_token); 
            setSendingOTP("Select Customer");
            }
        } catch (error) {
            console.log(error);
        }
    };
    //after verifying send it for otp
    useEffect(() => {
        //dispatch(cashPaymentPopup(true)); 
        localStorage.removeItem('methodActive');
        localStorage.removeItem('userBillingAddress')
        localStorage.removeItem("storeBillingAddress");
        localStorage.removeItem('selectedAddress');
        localStorage.removeItem('isSelectedAddress');
        if (!isUser && userMobile) {
            sendOtp();
        }
    }, [userMobile]); 


    // Search Results    
    const [searchProduct, setSearchProduct] = useState('');
    const [searchListedProduct, setSearchListedProduct] = useState(null);
    const [barCode, setBarCode] = useState("");

    


    const handleChange = (e) => {
        const value = e.target.value;
        setSearchProduct(value);
        setBarCode(''); 
        console.log(productsList);
    };

    useEffect(() => {       
        if(searchProduct) {
            dispatch(fetchProducts(searchProduct, agent.storeCode, agent.agentCodeOrPhone, customer_id, barCode))
        }
    }, [searchProduct, dispatch, agent.storeCode, agent.agentCodeOrPhone, customer_id]);

    const productsList = useSelector((state) => state.search.items);
    const { loading, error } = useSelector((state) => state.search);
    const { isAdding, cartCount } = useSelector((state) => state.atc);

    // Memoized filtered products
    const filteredProducts = useMemo(() => {               
        if (!productsList || !Array.isArray(productsList)) {
            console.error("Error: productsList is undefined or not an array");
            return [];
        }
        return productsList.filter((item) => {
            const productNameMatches = item.product_name && item.product_name.toLowerCase().includes(searchProduct.toLowerCase());
            const barCodeMatches = barCode ? item.product_barcode === barCode : true;  
            return productNameMatches || barCodeMatches;
        });
    }, [searchProduct, productsList]);

    //barcode product search
    const barCodeProductsList = useSelector((state) => state.barcode.barcodeItems);
    // Error handling using useEffect
    useEffect(() => {
        if (barCodeProductsList.statusCode === "SEARCHERROR") {
            toast.error("not found");
            dispatch(fetchBarcodeProductsFailure());
            dispatch(barcodeSet(""));
        }
    }, [barCodeProductsList.statusCode, dispatch]);

    // Filtering logic using useMemo
    const filteredBarcodeProducts = useMemo(() => {
        const products = barCodeProductsList?.products || [];
        return products.filter((item) => {
            const barcodeProductNameMatches = item.product_name?.toLowerCase().includes(searchProduct.toLowerCase());
            const barCodeMatchesData = barcodeData ? item.product_barcode === barcodeData : true;
            return barcodeProductNameMatches || barCodeMatchesData;
        });
    }, [barCodeProductsList, searchProduct, barcodeData]);

    // Handle clicking on a product
    const handleSearchClick = (product) => {
        dispatch(sheetOpen('searchResult'));
        setSearchListedProduct(product);
    };

    const handleAddToCart = () => {
        dispatch(sheetOpen('customerSearchBox'));
    }

    const addProductToCart = async (searchListedProduct) => {
        try {
            let data = JSON.stringify({
                query: `mutation {
                    AddProductToCart(input: {
                        customer_id: ${customer_id},
                        product: "${searchListedProduct.product_id}",
                        selected_configurable_option: "",
                        related_product: "",
                        item: "${searchListedProduct.product_id}",
                        form_key: "",
                        metal_id: "${searchListedProduct.product_data.metal[0].id}",
                        purity_id: "${searchListedProduct.metal_karat_selection}",
                        clarity_id: "${searchListedProduct.diamond_quality ? searchListedProduct.diamond_quality : 0}",
                        size_id: "${searchListedProduct.product_size}",
                        metal: "${searchListedProduct.product_data.metal[0].purity} ${searchListedProduct.product_data.metal[0].name} (${searchListedProduct.product_data.metal[0].weight})",
                        purity: "${searchListedProduct.product_data.metal[0].purity}",
                        clarity: "${searchListedProduct.product_data.stone[0].clarity ? searchListedProduct.product_data.stone[0].clarity : 0}",
                        stone_details: "${searchListedProduct.product_data.stone[0].weight}",
                        gemstone_details: "",
                        zirconia_details: "",
                        othermaterial_details: "",
                        metal_size: "",
                        gemstone: "",
                        zirconia: "",
                        engrave_text: "",
                        engrave_font: "",
                        metal_weight: "${searchListedProduct.product_data.metal[0].weight}",
                        stone_weight: "${searchListedProduct.product_data.stone[0].weight}",
                        gemstone_weight: "",
                        zirconia_weight: "",
                        othermaterial_weight: "${searchListedProduct.product_data.othermaterial?.weight || 0}",
                        total_weight: "${searchListedProduct.product_data.total_weight}",
                        custom_sku: "",
                        necklace_length: "",
                        product_id: "${searchListedProduct.product_id}",
                        priorityshipping_id: "${searchListedProduct.priorityshipping_id || 0}",
                        is_priority_shipping: "1",
                        qty: ${searchListedProduct.qty},
                        price_before_discount: "",
                        price_after_discount: "",
                        gold_rate: "",
                        email: "",
                        telephone: "",
                        agentCode: "${agent.agentCodeOrPhone}",
                        storeCode: "${agent.storeCode}"
                    }) {
                        quoteId
                        status
                        message
                        quoteMask
                        statusCode
                    }
                }`,
                variables: {}
            });
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: '/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
                },
                data: data
            };

            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            console.log(response.data.data.AddProductToCart.status);
            const { quoteId, quoteMask, status } = response.data.data.AddProductToCart;

            if (status === "success") {
                dispatch(addProductSuccess({ searchListedProduct, quoteId, quoteMask }));
                dispatch(sheetOpen(false));
                dispatch(setCartCount(cartCount+1));
                toast.success("Item Added Successfully", {
                    position: "bottom-center",
                    theme: "colored",
                    autoClose: 1500,
                });
            } else {
                dispatch(addProductFailure('Failed to add product to cart.'));
                toast.error("Failed to add product to cart.");
                dispatch(sheetOpen(false));
            }
        } catch (error) {
            dispatch(addProductFailure('An error occurred.'));
            toast.error(error.message);
            dispatch(sheetOpen(false));
        }
    }
    // Search Results

    return (
        <>
        <div className="searchBox">
            <BottomSheet
                open={isSheetId === "customerSearchBox" && isSheetOpen}
                onDismiss={() => dispatch(sheetClose())}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                header={
                    <div className='sheetHeader'>
                        <SectionTitle title="Customer Search" />
                        <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                            <img src={close} alt='BottomSheet Close' className='img-fluid' />
                        </div>
                    </div>
                }
            >
                <div className='sheetBody'>
                {!isUser &&(
                    <div className="searchBox--item">
                        <div className="searchBox--action">
                            <p className="searchBox--action-title">Customer Details</p>                       
                            <p className="searchBox--action-link" title="Add Customer" onClick={() => dispatch(sheetOpen('addCustomer'))}>Add Customer</p>                       
                        </div>                   
                        <div className="searchBox--input">
                            <div className="input_group_container">
                                <div className="input_group_">
                                    <input
                                        className="input_type_text"
                                        type="text"
                                        placeholder="Search Customer using Mobile No"
                                        value={searchCustomer}
                                        onChange={(e) => setsearchCustomer(e.target.value)}
                                    />
                                    <div className="searchBox--input-icon" title="Search">
                                        <img src={search} alt="Search" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>  
                            {loadingCustomer ? (
                                <div className="loadingCustomer">
                                    <img src={remove}/>
                                </div> // Display loading message
                            ) : filteredCustomers.length > 0 && (
                                <div className="searchResults-wrapper">
                                    {filteredCustomers.map((customer) => {                                
                                        const fullName = `${customer.firstname} ${customer.lastname}`;
                                        const phone = customer.phone ? customer.phone : 'Phone not available'; // Access phone directly
                                        const customerEmail = customer.email;
                                        const customerID = customer.id;

                                        return (
                                            <div className="searchResults" key={customer.id} onClick={() => loginVerify(phone, fullName, customerEmail, customerID)}>
                                                <div className='searchResults-left'>
                                                    <div className="userData">
                                                        <p className='userData-text'>{fullName}</p>
                                                        <p className='userData-text'>{phone}</p> {/* Phone is accessed directly */}
                                                        <p className='userData-text'>{customer.email}</p>
                                                    </div>
                                                </div>
                                                <div className='searchResults-right'>
                                                    <p 
                                                        alt="Select Customer" 
                                                        className="searchResults-action editCustomer"                                            
                                                    >
                                                        {sendingOTP}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}                
                    </div>
                )}
                </div>
            </BottomSheet>
            
            <div className="searchBox--item">
                <div className="searchBox--action">
                    <p className="searchBox--action-title">Search Product</p>
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
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <BarcodeScanner />
                </div>               
                    {loading && <p className='searchBox--item-loading'>Loading...</p>}
                    {error && <p className='searchBox--item-error'>Error: {error}</p>}
                    {filteredProducts.length === 0 || filteredBarcodeProducts === 0 ? ("") : (
                        <div className="searchResults-wrapper">
                            {filteredProducts.map((product) => (
                                <div className="searchResults" key={product.priorityshipping_id} onClick={() => handleSearchClick(product)}>
                                    <div className='searchResults-left'>
                                        <div className="filter">
                                            <div className="filter--card">
                                                <div className="filter--card-image">
                                                    <img src={product.product_data.images[0].metal_image} alt="Product Name" className="img-fluid" />
                                                </div>
                                                <div className="filter--card--data">
                                                    <p className="filter--card--data-name">{product.product_name}</p>
                                                    <div className="filter--card--data-price">
                                                        <p className="filter--card--data-price-new">&#8377;{Math.trunc(product.product_data.discount_applied_price)}</p>
                                                        <p className="filter--card--data-price-old">&#8377;{Math.trunc(product.product_data.price)}</p>
                                                    </div>
                                                    <p className="filter--card--data-offer">{product.product_data.discount_label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                                                 
                                    <div className="searchResults-action addProduct">View Product</div>
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
                    onDismiss={() => {
                        //dispatch(sheetClose());
                        setSendingOTP("Select Customer");
                    }}
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
           
           <BottomSheet
                open={isSheetId === "searchResult" && isSheetOpen}
                onDismiss={() => dispatch(sheetClose())}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                header={
                    <div className='sheetHeader'>
                        <SectionTitle title="Product Details" />
                        <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                            <img src={close} alt='BottomSheet Close' className='img-fluid' />
                        </div>
                    </div>
                }
                footer={
                    <div className='sheetFooter'>
                        <button
                            className="addProduct base_btn btn_lg primary_btn"
                            onClick={() => {
                                if (isUser) {
                                    addProductToCart(searchListedProduct);
                                } else {
                                    handleAddToCart();
                                }
                            }}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding to cart...' : 'Add Product'}
                        </button>
                    </div>
                }
            >
                <div className='sheetBody' product={searchListedProduct} style={{ marginTop: 0 }}>
                    {searchListedProduct ? <Filter searchProductID={searchListedProduct.priorityshipping_id} />: <p>No product selected</p>}
                </div>
            </BottomSheet>
           
        </>
    );
};

export default Searchbox;
