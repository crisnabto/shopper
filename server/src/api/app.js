const express = require('express');
const cors = require('cors');
const productsController = require('../controllers/products.controller');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/products', productsController.getAllProducts);

app.get('/products/:code', productsController.getProductByCode);

app.put('/products/:code', productsController.updatePrice);

module.exports = app;
