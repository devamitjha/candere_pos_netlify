import axios from 'axios';

// Function to set the shipping method using async/await
export const setShippingMethod = async (customerId, token, carrierCode, methodCode) => {
  const data = JSON.stringify({
    query: `mutation SetShippingMethod($input: SetShippingMethodPosInput!) {
      SetShippingMethodPos(input: $input) {
        status
        message
      }
    }`,
    variables: {
      "input": {
        "customer_id": customerId,
        "carrier_code": carrierCode,
        "method_code": methodCode
      }
    }
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/graphql',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`, 
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error setting shipping method:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
