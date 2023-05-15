const productsModel = require('../models/products.model');
const validatePrice  = require('../middlewares/validations');

const getAllProducts = async () => {
  const data = await productsModel.getAllProducts();
  return { type: 200, message: data };
};

const getProductByCode = async (productCode) => {
  if (!productCode) {
    return { type: 400, error: 'Product code is required' };
  }
  const product = await productsModel.getProductByCode(productCode);

  if (product[0].length > 0) return { type: 200, message: product };
  return { type: 404, error: 'Product not found' };
}

const updatePrice = async (productCode, newPrice) => {
  const validCode = await getProductByCode(productCode);
  if (validCode.error) return { type: 404, message: validCode.error };

  // const validData = validatePrice(validCode.message, newPrice);
  // if (validData) return { type: 404, message: validData }

  // const product = await getProductByCode(productCode, newPrice);
  // console.log(product.message[0]);
  await productsModel.updatePrice(productCode, newPrice);
  const result = await productsModel.getProductByCode(productCode);
  return { type: 200, message: result };
};

module.exports = { getAllProducts, getProductByCode, updatePrice };
