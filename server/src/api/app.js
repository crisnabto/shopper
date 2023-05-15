const express = require('express');
const cors = require('cors');
const multer = require('multer');
const productsController = require('../controllers/products.controller');
const { validateFile } = require('../middlewares/validations');

const upload = multer().single('file');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/products', productsController.getAllProducts);

app.get('/products/:code', productsController.getProductByCode);

app.post('/products/validation', (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Upload failed' });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    validateFile(req, res, next);
  });
});

app.put('/products/:code', productsController.updatePrice);

module.exports = app;
