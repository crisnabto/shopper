const productsService = require('../services/products.service');

const getAllProducts = async (req, res) => {
  const { type, message } = await productsService.getAllProducts();
  return res.status(type).json(message);
};

const getProductByCode = async (req, res) => {
  const { code } = req.params;
  const { type, message, error } = await productsService.getProductByCode(code);
  if (error) return res.status(type).json({ message: error });
  return res.status(type).json(message);
}

const updatePrice = async (req, res) => {
  const { code } = req.params;
  const { price } = req.body;
  const { type, message, error } = await productsService.updatePrice(code, price);
  if (error) return res.status(404).json({ message: error });
  return res.status(type).json(message);
}

module.exports = { getAllProducts, getProductByCode, updatePrice };
