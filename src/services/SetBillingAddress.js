import axios from 'axios';

// Function to set the billing address on the cart using async/await
export const setBillingAddressOnCart = async (cartId, token, address) => {
  let data = JSON.stringify({
    query: `mutation SetBillingAddressOnCart {
      setBillingAddressOnCart(
        input: {
          cart_id: "${cartId}"
          billing_address: {
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
        }
      ) {
        cart {
          billing_address {
            firstname
            lastname
            company
            street
            city
            region {
              code
              label
            }
            postcode
            telephone
            country {
              code
              label
            }
          }
        }
      }
    }`,
    variables: {}
  });

  let config = {
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
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error setting billing address on cart:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};
