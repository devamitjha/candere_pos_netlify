// productSearchActions.js
import axios from 'axios';
import { searchRequest, searchSuccess, searchFailure } from '../redux/searchProductSlice';

export const fetchSearchResults = (userToken, searchTerm, agentCode, storeCode, customerId) => async (dispatch) => {
  dispatch(searchRequest());

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/rest/V1/pos-productmanagement/productsearch',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    data: JSON.stringify({
      storeCode: storeCode,
      agentCode: agentCode,
      customerId:customerId,
      searchTerm: searchTerm,
      barcode: ""
    }),
  };

  try {
    const response = await axios.request(config);
    dispatch(searchSuccess(response.data.items)); // Assuming `items` contains the product array
  } catch (error) {
    dispatch(searchFailure(error.message));
  }
};
