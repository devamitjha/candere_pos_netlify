import axios from 'axios';

// Function to set the payment method on the cart using async/await
export const setPaymentMethodOnCart = async (cartId, paymentCode, authToken) => {
  const data = JSON.stringify({
    query: `mutation {
      setPaymentMethodOnCart(input: {
          cart_id: "${cartId}"
          payment_method: {
              code: "${paymentCode}"
          }
      }) {
        cart {
          selected_payment_method {
            code
          }
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
      'Authorization': `Bearer ${authToken}`, 
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data)); // Print the response data
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('Error setting payment method:', error); // Handle errors
    throw error; // Re-throw the error if you want to handle it in the calling function
  }
};
