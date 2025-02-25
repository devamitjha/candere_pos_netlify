import axios from 'axios';

// Function to create a POS order using async/await
export const fetchCartData = async (customer_id, agentCodeOrPhone, storeCode) => {
    const data = JSON.stringify({
        query: `query GetCartDetail($input: CartDetailInput!) {
          CartDetail(input: $input) {
            status
            message
            statusCode
            quote_mask_id
            quote_id
            productData {
              quote_item
              product_id
              name
              price
              discount_amount
              image
              additional_options
              info_buyRequest
              total_weight
              gemstone_weight
              stone_weight
              metal_weight
              custom_sku
              clarity_id
              purity_id
              metal_id
              size_id
              sku
              all_sizes
              qty
              all_qty
              product_url
              quote_currency
            }
          }
        }`,
        variables: { "input": { "customer_id": customer_id, "agentCode": agentCodeOrPhone, "storeCode": storeCode } }
      });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/graphql',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.error('Error creating POS order:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
 
};
