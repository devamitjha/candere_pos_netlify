import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from '../../components/tabs/Tabs';
import back from '../../assets/images/back.svg';
import userImage from '../../assets/images/user.svg'; // renamed import to avoid conflict
import trash from "../../assets/images/trash.svg";
import edit from "../../assets/images/checkoutEdit.svg";
import { logoutUser } from '../../redux/userSlice';
import { clearCart } from '../../redux/atcSlice';
import { BottomSheet } from 'react-spring-bottom-sheet';
import SectionTitle from '../../components/sectionTitle/SectionTitle';
import close from "../../assets/images/close.svg";
import axios from 'axios';
import { setCustomerAddressData, clearCustomerAddressData} from '../../redux/customerAddressSlice'; 
import { toast } from 'react-toastify';

const Profile = () => {
    const [showAddress, setShowAddress] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user); // renamed to userInfo
    const currentAddressesList = useSelector((state) => state.customerAddress.addresses);
    const info = useSelector((state) => state.customerAddress.customerInfo);
    const { token } = useSelector((state) => state.user);

    const handleDismiss = () => {
        setOpen(false);
    };
    const addNewUserAddress = ()=>{
        setShowAddress(true);
        setOpen(true);
    }

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(clearCart());
        dispatch(clearCustomerAddressData());
        localStorage.removeItem('isSelectedAddress');
        localStorage.removeItem('CustomerAddressData');
        localStorage.removeItem('updateProfile');
        navigate('/');
    }   

    const addressList = currentAddressesList.map((item, index) => (
        <div key={index} className="addressBox--wrap">
            <div className="addressBox--body">
                <div className="addressBox--data">
                    <div className="addressBox--card">
                        <p className="addressBox--card-text">                                                     
                            <span>{item.firstname} {item.lastname}</span>
                        </p>
                        <div className="addressBox--card-address">                                
                            <p>{item.street}, {item.city}, {item.region.region}, {item.postcode}, {item.country_code}</p>
                        </div>
                        <p className="addressBox--card-text">Mobile: <span>{item.telephone}</span></p>
                    </div>
                </div>
            </div>
            <div className="addressBox--foot">
                <div className="addressBox--foot-action">
                    <div className="addressBox--foot-action-child">
                        <img src={trash} alt="Delete" className="img-fluid" />
                    </div>
                    <div className="addressBox--foot-action-child">
                        <img src={edit} alt="Edit" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    ));

    const [formData, setFormData] = useState({
        firstName: '',
        lastName:'',
        mobileNumber: '',
        pincode: '',
        city: '',
        state: '',
        country: 'India',
        roomNumber: '',
        region: "",
        region_code: "",
        region_id: null,
        gender: '', // Gender will be 1 for Male, 0 for Female
        dob: '',
      });

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const mobileNumberRef = useRef(null);
    const pincodeRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const roomNumberRef = useRef(null);
    const countryRef = useRef(null);

    //form validation 
    const validateForm = () => {
        if (!formData.firstName.trim()) {
          toast.error('First Name is required');
          firstNameRef.current.focus();
          return false;
        }

        if (!formData.lastName.trim()) {
            toast.error('Last Name is required');
            lastNameRef.current.focus();
            return false;
        }
    
        if (!formData.mobileNumber.trim()) {
          toast.error('Mobile Number is required');
          mobileNumberRef.current.focus();
          return false;
        }
    
        if (!formData.pincode.trim()) {
          toast.error('Pincode is required');
          pincodeRef.current.focus();
          return false;
        }
    
        if (!formData.city.trim()) {
          toast.error('City is required');
          cityRef.current.focus();
          return false;
        }
    
        if (!formData.state.trim()) {
          toast.error('State is required');
          stateRef.current.focus();
          return false;
        }
    
        if (!formData.roomNumber.trim()) {
          toast.error('Room Number is required');
          roomNumberRef.current.focus();
          return false;
        }

        if (!formData.country.trim()) {
            toast.error('Country is required');
            countryRef.current.focus();
            return false;
          }
        
    
        return true; // Validation passed
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const fetchCityAndState = (pincode) => {
    const data = JSON.stringify({
        query: `{
        PinCode(input: { pincode: "${pincode}", countrycode: "IN" }) {
            city
            state
        }
        }`,
    });

    axios.post('/graphql', data, {
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => {
        const { city, state } = response.data.data.PinCode;
        setFormData((prev) => ({ ...prev, city, state }));
        })
        .catch((error) => console.log(error));
    };

    const fetchRegions = (country) => {
    const data = JSON.stringify({
        query: `query getRegions($country: String!) {
        CountriesRegion(input: { country_code: $country }) {
            region_name
            region_id
            region_code
        }
        }`,
        variables: { country },
    });

    axios.post('/graphql', data, {
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => {
        const regions = response.data.data.CountriesRegion;
        const matchingRegion = regions.find(region => region.region_name === formData.state);
        const matchedRegion_id = matchingRegion.region_id;
        const matchedRegion_Name = matchingRegion.region_name;
        const matchedRegion_Code = matchingRegion.region_code;
        setFormData((prev) => ({
            ...prev,
            region: matchedRegion_Name,
            region_code: matchedRegion_Code,
            region_id: matchedRegion_id
        }));
        })
        .catch((error) => console.log(error));
    };

    useEffect(() => {        
        if (formData.pincode.length === 6) {
            fetchCityAndState(formData.pincode);
        }
    }, [formData.pincode]);

    useEffect(() => {  
        if (formData.city) {
            fetchRegions("IN");
        }
    }, [formData.city]);

    const submitAddressForm = () => {
    if (validateForm()) {
        createCustomerAddress();
    }
    };
    

    const createCustomerAddress = async () => {
        const data = JSON.stringify({
          query: `mutation {
            createCustomerAddress(input: {
               region: {
                    region:"${formData.region}"
                    region_code:"${formData.region_code}"
                    region_id: "${formData.region_id}"
                }
                country_code: IN
                street: ["${formData.roomNumber}"]
                telephone: "${formData.mobileNumber}"
                postcode: "${formData.pincode}"
                city: "${formData.city}"
                firstname: "${formData.fullName}"
                lastname: "${formData.lastName}"
                default_shipping: true
                default_billing: false
            }) {
              id
              region {
                region
                region_code
                region_id
              }
              country_code
              street
              telephone
              postcode
              city
              default_shipping
              default_billing
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
            'Authorization': `Bearer ${token}`
          },
          data: data
        };
      
        try {          
          const response = await axios.request(config);
          const customerID = response.data.data.createCustomerAddress.id
          if(customerID){          
            const responseAddress = response.data.data.createCustomerAddress;
            const shipping_addresses = {
                address_id: customerID,
                street:responseAddress.street,
                city: responseAddress.city,
                postcode: responseAddress.postcode,
                region: responseAddress.region.region,
                country:responseAddress.country_code,
                telephone: responseAddress.telephone,
                is_default_billing:false,
                is_default_shipping:true
            };
            dispatch(setCustomerAddressData({
                customerInfo: {
                  id:customerID,
                  name: userInfo.name,
                  email:userInfo.email,
                  phone: userInfo.phone,
                },
                addresses: [shipping_addresses]
              }));
              setShowAddress(false);
              setOpen(false);
              setFormData({
                firstName: '',
                lastName: '',
                mobileNumber: '',
                pincode: '',
                city: '',
                state: '',
                country: 'India',
                roomNumber: '',
                region: '',
                region_code: '',
                region_id: null,
              });
          }

        } catch (error) {
          console.error('Error creating customer address:', error);
        }
    };

    const addNewAddress = () => (
        <BottomSheet
            open={open}
            onDismiss={handleDismiss}
            defaultSnap={({ snapPoints, lastSnap }) =>
                lastSnap ?? Math.min(...snapPoints)
            }
            snapPoints={({ maxHeight }) => [
                maxHeight - maxHeight / 2.5,
                maxHeight * 0.7,
            ]}
            header={
                <div className='sheetHeader'>
                    <SectionTitle title="Add New Address" />
                    <div className='sheetHeader--close' onClick={handleDismiss}>
                        <img src={close} alt='BottomSheet Close' className='img-fluid' />
                    </div>
                </div>
            }
        >
            <div className='sheetBody'>
                <form className='sheetBody--form'>
                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="firstName"
                        placeholder="First Name" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                        ref={firstNameRef}
                    />
                    <div className="label_ pushedUp">First Name</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="lastName"
                        placeholder="Last Name" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                        ref={lastNameRef}
                    />
                    <div className="label_ pushedUp">Last Name</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="mobileNumber"
                        placeholder="Mobile Number" 
                        value={formData.mobileNumber} 
                        onChange={handleInputChange} 
                        ref={mobileNumberRef}
                    />
                    <div className="label_ pushedUp">Mobile Number</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="pincode"
                        placeholder="Zip/Postal Code" 
                        value={formData.pincode} 
                        onChange={handleInputChange} 
                        ref={pincodeRef}
                    />
                    <div className="label_ pushedUp">Zip/Postal Code</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="roomNumber"
                        placeholder="Room/Flat/Building No." 
                        value={formData.roomNumber} 
                        onChange={handleInputChange} 
                        ref={roomNumberRef}
                    />
                    <div className="label_ pushedUp">Room/Flat/Building No.</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="country"
                        placeholder="Country" 
                        value={formData.country} 
                        ref={countryRef}
                        onChange={handleInputChange} 

                    />
                    <div className="label_ pushedUp">Country</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="state"
                        placeholder="State/Province" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        ref={stateRef}
                        readOnly 
                    />
                    <div className="label_ pushedUp">State/Province</div>
                    </div>
                </div>

                <div className="input_group_container">
                    <div className="input_group_">
                    <input 
                        className="input_type_text" 
                        type="text" 
                        name="city"
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        ref={cityRef}
                        readOnly 
                    />
                    <div className="label_ pushedUp">City</div>
                    </div>
                </div>

                <div className='base_btn btn_lg primary_btn' onClick={submitAddressForm}>Save</div>
                </form>
            </div>
        </BottomSheet>
    );

    useEffect(() => {
        const savedData = localStorage.getItem('updateProfile');
        if (savedData) {
          setFormData(JSON.parse(savedData)); // Update state with saved data
        }
    }, []); 

    const handleGenderChange = (e) => {
        setFormData({
            ...formData,
            gender: e.target.value,
        });
    };
    
      // Handle Date of Birth Change
    const handleDobChange = (e) => {
        setFormData({
            ...formData,
            dob: e.target.value,
        });
    };

    const handleUpdateProfile = async () => {
        if (!formData.gender || !formData.dob) {
            toast.error('Please fill out all fields!');
            return;
        }

        const completeData = {
            ...info, // Prefilled data
            ...formData, // User-updated data
        };

        // Save data to localStorage
        localStorage.setItem('updateProfile', JSON.stringify(completeData));

        const data = JSON.stringify({
            query: `mutation {
            updateCustomer(
                input: {
                firstname: "${completeData.name}"
                email: "${completeData.email}"
                dob: "${completeData.dob}"
                gender: "${completeData.gender}"
                }
            ) {
                customer {
                firstname
                email
                }
            }
            }`,
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/graphql',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            data,
        };

        try {
            const response = await axios.request(config);
            console.log('API Response:', response.data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        }
    };

    return (
        <>
            <div className='pageTitle'>
                <div onClick={() => navigate(-1)} className='pageTitle-back'>
                    <img src={back} className='img-fluid' alt='Back' />
                </div>
                <div className='pageTitle-title'>User Profile</div>
            </div>
            <div className='profile'>
                <div className="profile-wrapper">
                    <div className="profile-wrapper-left">
                        <div className='profile--image'>
                            <img src={userImage} className='img-fluid' alt='User Image' /> {/* renamed to userImage */}
                        </div>
                    </div>
                    <div className="profile-wrapper-right">
                        <div className='profile-logout' onClick={handleLogout}>Customer Logout</div>
                    </div>
                </div>
                <Tabs>
                    <Tabs.TabHeader>Customer Profile</Tabs.TabHeader>
                    <Tabs.TabHeader>Address Book</Tabs.TabHeader>
                    
                    <Tabs.TabPanel>
                    <form className='customForm'>
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input className="input_type_text" type="text" placeholder="First Name" value={info.name} />
                                <div className="label_ pushedUp">Name</div>
                            </div>
                        </div>                       
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input className="input_type_text" type="email" placeholder="Email" value={info.email} />
                                <div className="label_ pushedUp">Email</div>
                            </div>
                        </div>
                        <div className="input_group_container">
                            <div className="input_group_">
                                <input className="input_type_text" type="text" placeholder="Mobile No." value={info.phone} />
                                <div className="label_ pushedUp">Mobile No.</div>
                            </div>
                        </div>
                        {/* <div className="input_group_container">
                            <div className="input_group_">
                                <input className="input_type_text" type="text" placeholder="Alternate Mobile No. (Optional)" value="" />
                                <div className="label_ pushedUp">Alternate Mobile No. (Optional)</div>
                            </div>
                        </div> */}
                        <div className="input_group_container">
                            <div className="custome_select">
                                <select
                                    className="type_select"
                                    value={formData.gender}
                                    onChange={handleGenderChange} // Update gender
                                >
                                    <option value="" disabled>
                                    Select Gender
                                    </option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                </select>
                                <div className="label_ pushedUp">Gender</div>
                            </div>
                        </div>
                        <div className="input_group_container">
                            <div className="input_group_">
                            <input
                                className="input_type_text"
                                type="date"
                                placeholder="Date of Birth (Optional)"
                                value={formData.dob}
                                onChange={handleDobChange} // Update DOB
                            />
                                <div className="label_ pushedUp">Date of Birth (Optional)</div>
                            </div>
                        </div>

                        <div className='profile-updateBtn base_btn primary_btn btn_lg' onClick={handleUpdateProfile}>Update</div>
                    </form>
                </Tabs.TabPanel>
                    
                    <Tabs.TabPanel>
                        <div className="addressBox">
                            {addressList}
                            <div className="addAddress" onClick={addNewUserAddress}>Add New Address</div>
                        </div>
                    </Tabs.TabPanel>
                </Tabs>
            </div>

            { !currentAddressesList || currentAddressesList.length === 0 || !info && <div className="addAddress" onClick={addNewUserAddress}>Add New Address</div> }            

            {showAddress && addNewAddress()}

        </>
    );
}

export default Profile;
