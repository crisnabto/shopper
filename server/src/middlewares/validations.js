const validatePrice = (product, newPrice) => {
  const { sales_price } = product[0][0];

  const MIN = parseFloat(sales_price * 0.9).toFixed(2);
  const MAX = parseFloat(sales_price * 1.1).toFixed(2);

  if (newPrice < sales_price) return { error: 'Sales price cant be less than cost price' };
  if (newPrice > MAX || newPrice < MIN) return { error: 'Sales price is out of 10% range variation' };
}

module.exports = validatePrice;
