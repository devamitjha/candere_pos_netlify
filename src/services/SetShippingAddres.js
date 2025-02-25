import axios from 'axios';

// Function to set the shipping address using async/await
export const setShippingAddress = async (cartId, token, address) => {
  const data = JSON.stringify({
    query: `mutation SetShippingAddressOnCart {
      setShippingAddressesOnCart(
        input: {
          cart_id: "${cartId}"
          shipping_addresses: [
            {
              address: {
                firstname: "${address.firstname}"
                lastname: "${address.lastname}"
                company: ""
                street: ["${address.street}"]
                city: "${address.city}"
                region: "${address.region.region || address.region}"
                region_id: ${address.region.region_id || address.region_id}
                postcode: "${address.postcode}"
                country_code: "${address.country_code}"
                telephone: "${address.telephone}"
                save_in_address_book: false
              }
            }
          ]
        }
      ) {
        cart {
          shipping_addresses {
            firstname
            lastname
            company
            street
            city
            postcode
            telephone
            country {
              code
              label
            }
            available_shipping_methods {
              carrier_code
              carrier_title
              method_code
              method_title
            }
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
      'Authorization': `Bearer ${token}`, // Use the actual token
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(response.data); // Print the response data to the console
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error setting shipping address:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
