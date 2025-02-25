import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SectionTitle from '../sectionTitle/SectionTitle';
import close from "../../assets/images/close.svg";
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice'; // Import Redux actions
import './pageinfo.scss';
import axios from 'axios';
import Address from '../../components/address/Address';
import { clearSelectedAddress, setCheckboxChecked } from '../../redux/selectedAddressSlice';
import CurrentAddress from "../../components/address/CurrentAddress"
import DefaultStoreAddress from "../../components/address/DefaultStoreAddress"
import { toast } from 'react-toastify';

const Pageinfo = (props) => {
  const location = useLocation();
  const isPaymentPage = location.pathname === '/checkout/payment';
  const { token } = useSelector((state) => state.user);
  const { isSelectedAddress, checkboxChecked} = useSelector((state) => state.selectedAddress);

  const dispatch = useDispatch();
  const isSheetOpen = useSelector((state) => state.bottomSheet.isSheetOpen);
  const isSheetId = useSelector((state) => state.bottomSheet.isSheetId);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    if(isChecked===true){
      dispatch(clearSelectedAddress());
      dispatch(setCheckboxChecked(false));
      toast.warn("Selected Address will be Removed", {
        theme: "colored",
        autoClose: 500,
      });    
      setIsChecked(false);  
      localStorage.removeItem("methodActive");      
    }else{
      const isChecked = event.target.checked;
      setIsChecked(isChecked);
      isChecked && dispatch(sheetOpen('addAddress'));
      dispatch(setCheckboxChecked(isChecked));
    }    
  };

  const handleDismiss = () => {
    dispatch(sheetClose());
    if(checkboxChecked && isSelectedAddress){
      setIsChecked(true);
    }else{
      setIsChecked(false);
    }
  };

  //save address
  const createCustomerAddress = async () => {
    const data = JSON.stringify({
      query: `mutation {
        createCustomerAddress(input: {
           region: {
                region: "Arizona"
                region_code: "AZ"
                region_id:"4"
            }
            country_code: US
            street: ["123 Main Street"]
            telephone: "7777777777"
            postcode: "77777"
            city: "Phoenix"
            firstname: "Bob"
            lastname: "Loblaw"
            default_shipping: true
            default_billing: false
        }) {
          id
          region {
            region
            region_code
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
      console.log(JSON.stringify(response.data));
      // Handle the response data as needed
    } catch (error) {
      console.error('Error creating customer address:', error);
      // Handle the error as needed
    }
  };
  
  // Example button to trigger the function
  const handleButtonClick = () => {
    createCustomerAddress();
  };

  const addresses = useSelector((state) => state.address.addresses);

  useEffect(() => {
   if(isSelectedAddress==='true'){
    setIsChecked(true);
    dispatch(setCheckboxChecked(true));
   }
  }, [isSelectedAddress, dispatch]);

 

//address tab
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab
  const storedBillingAddress = localStorage.getItem('storeBillingAddress');
  const savedAddress = localStorage.getItem('userBillingAddress');



  const tabs = [
    { title: 'Default Store Address', content: <DefaultStoreAddress /> },
    { title: 'Current Address', content: <CurrentAddress /> },
  ];

  useEffect(() => {
    if (storedBillingAddress) {
      setActiveTab(0);
    } else if (savedAddress) {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [storedBillingAddress, savedAddress]);


  return (
    <>
      <div className="pageInfo">
          <p className="pageInfo-title">{props.title}</p>
          {!isPaymentPage && <p className="pageInfo-count">{props.count}</p>}
          {/* <label className="switch" onChange={handleCheckboxChange}>
            <input type="checkbox" checked={isChecked}/>
            <span className="slider"></span>
          </label>  */}
      </div>
      {
        isPaymentPage && (
          <div className="tabs-container">
            <div className="tabs-headers">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`tab-button tabs-header ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {tabs[activeTab].content}
            </div>
          </div>
        )
      }
      

      <BottomSheet
            open={isSheetId === 'addAddress' && isSheetOpen}
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
                    {addresses ?<SectionTitle title="Select Shipping Address" /> : <SectionTitle title="Add New Address" /> }
                    <div className='sheetHeader--close' onClick={handleDismiss}>
                        <img src={close} alt='BottomSheet Close' className='img-fluid' />
                    </div>
                </div>
            }
        >

        {!addresses || addresses.length === 0 ? (
          <div className='sheetBody'>
            <form className='sheetBody--form'>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="Full Name" value="Tahir Kutty" />
                  <div className="label_ pushedUp">Name</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="Mobile Number" value="8956743210" />
                  <div className="label_ pushedUp">Mobile Number</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="Zip/Postal Code" value="400064" />
                  <div className="label_ pushedUp">Zip/Postal Code</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="Room/Flat/Building No." value="Content" />
                  <div className="label_ pushedUp">Room/Flat/Building No.</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="Country" value="Content" />
                  <div className="label_ pushedUp">Country</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="State/Province" value="Content" />
                  <div className="label_ pushedUp">State/Province</div>
                </div>
              </div>
              <div className="input_group_container">
                <div className="input_group_">
                  <input className="input_type_text" type="text" placeholder="City" value="Content" />
                  <div className="label_ pushedUp">City</div>
                </div>
              </div>

              <div className='base_btn btn_lg primary_btn' onClick={handleButtonClick}>Save</div>
            </form>
          </div>
        ) : (
          <Address />
        )}
           
        </BottomSheet>
    </>
  )
}

export default Pageinfo;
