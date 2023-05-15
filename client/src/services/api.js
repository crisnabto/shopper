import axios from 'axios';

const defaultPort = 3001;

const port = process.env.REACT_APP_BACKEND_PORT || defaultPort;

const api = axios.create({
  baseURL: `http://localhost:${port}`,
});

export const getAllProducts = async () => {
  const result = await api.get('/products');
  return result.data;
}

export const getProductByCode = async (productCode) => {
  const result = await api.get(`/products/${productCode}`);
  console.log('result');
  return result.data;
}

export const validateFile = async (formData) => {
  const response = await api.post('/products/validation', formData);
  return response;
}

export const updatePrice = async (productCode, newPrice) => {
  const result = await api.put('/products/:code');
  return result.data;
}
