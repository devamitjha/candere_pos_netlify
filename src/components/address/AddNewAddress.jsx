import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import SectionTitle from '../sectionTitle/SectionTitle';
import close from "../../assets/images/close.svg";
import axios from 'axios';
import { setCustomerAddressData} from '../../redux/customerAddressSlice'; 
import { toast } from 'react-toastify';
import {sheetClose } from '../../redux/bottomSheetSlice'; 
import { setAddresses, setLoading, setError } from '../../redux/addressSlice'; 

const AddNewAddress = () => {  
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user);
    const {isSheetOpen} = useSelector((state) => state.bottomSheet);
    const { token } = useSelector((state) => state.user);
    const [loadAddress, setLoadAddress] = useState(false);

    const handleDismiss = () => {
        dispatch(sheetClose());
    };    
    
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
        region_id: null
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


    //fetch shipping address
    let data = JSON.stringify({
        query: `{
          customer {
            firstname
            lastname
            suffix
            email
            addresses {
              firstname
              lastname
              street
              city
              region {
                region_code
                region
                region_id
              }
              postcode
              country_code
              telephone
              default_billing
              default_shipping
              id
            }
          }
        }`,
        variables: {},
      });
    
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: data,
      };
    
      const fetchShippingAddress = async () => {
        try {
          dispatch(setLoading()); // Set loading state
          const response = await axios.request(config);
          const addresses = response.data.data.customer;
          if (addresses) {
            setLoadAddress(true);
            dispatch(setAddresses(addresses)); // Dispatch the addresses to the store
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
          dispatch(setError('Failed to fetch addresses')); // Set error state
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
                firstname: "${formData.firstName}"
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
              dispatch(sheetClose());            
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
              fetchShippingAddress();
          }

        } catch (error) {
          console.error('Error creating customer address:', error);
        }
    };

    const addNewAddress = () => (
        <BottomSheet
            open={isSheetOpen}
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

    return (
        <>                 

            {addNewAddress()}

        </>
    );
}

export default AddNewAddress;
