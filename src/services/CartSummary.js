import axios from 'axios';

// Function to get cart summary using async/await
export const cartSummary = async (userToken, userSession) => {  
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '/api/default/V1/carts/mine/totals',
    headers: { 
      'Authorization': `Bearer ${userToken}`,
     // 'Cookie': `PHPSESSID=${userSession}` 
    }
  };

  try {
    const response = await axios.request(config);
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Rethrow the error to handle it in the calling code
  }
};
