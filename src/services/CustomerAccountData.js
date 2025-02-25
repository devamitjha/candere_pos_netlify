import axios from 'axios';

// Function to get customer account data using async/await
export const customerAccountData = async (userToken, customerId) => {  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/rest/V1/pos-customermanagement/customeraccountdata',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${userToken}`, 
    },
    data: JSON.stringify({
      "customer_id": customerId // Passing the customer ID in the body
    })
  };

  try {
    const response = await axios.request(config);
    return response.data; // Return the response data on success
  } catch (error) {
    throw error; // Rethrow error to handle it in the calling code
  }
};
