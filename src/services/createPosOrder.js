import axios from 'axios';

// Function to create a POS order using async/await
export const createPosOrder = async (cartId) => {
  const data = JSON.stringify({
    query: `mutation {
      CreatePosOrder(
        input: {
          cart_id: "${cartId}"
        }
      ) {
        message
        paymentLink
        status
        statusCode
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
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log('POS order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating POS order:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};
