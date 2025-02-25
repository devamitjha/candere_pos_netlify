const CalculateValues = (orderTotal) => {
  if (!orderTotal || !Array.isArray(orderTotal.total_segments)) {
    return []; // If orderTotal or total_segments doesn't exist, return an empty array
  }

  let subtotalValue = 0;
  let discountValue = 0;
  let shippingValue = 0;
  let grandTotalValue = 0;
  let walletAmount = 0;
  let reward = 0;
  let insuranceValue = 0;

  const segments = orderTotal.total_segments.reduce((acc, segment) => {
    switch (segment.code) {
      case "subtotal":
        subtotalValue = segment.value;
        acc.push({ title: "Item total", value: segment.value });
        break;
      case "discount":
        discountValue = -segment.value;
        acc.push({ title: `Discount (${orderTotal.coupon_code})`, value: segment.value });
        break;
      case "shipping":
        shippingValue = segment.value === 0 ? 'Free' : segment.value;
        acc.push({ title: `Shipping & Handling`, value: shippingValue });
        break;
      case "insurance":
        insuranceValue = Math.round((subtotalValue - discountValue - reward) * 0.01);
        acc.push({ title: "Insurance", value: insuranceValue });
        break;
      case "reward":
        reward = -segment.value;
        acc.push({ title: "Promo Wallet", value: -segment.value });
        break;
      case "wallet_amount":
        walletAmount = -segment.value;
        acc.push({ title: "Wallet", value: -segment.value });
        break;
      case "grand_total":
        grandTotalValue = subtotalValue - discountValue - reward;
        acc.push({ title: "Grand Total", value: grandTotalValue });
        localStorage.setItem("grandTotal", Math.trunc(grandTotalValue));
        break;
      default:
        break;
    }
    return acc;
  }, []);

  return segments; // Return the calculated segments array
};

export default CalculateValues;
