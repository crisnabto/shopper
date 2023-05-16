const fs = require('fs');
const streamifier = require('streamifier');
const csv = require('csv-parser');
const productsModel = require('../models/products.model');

const validateFile = (req, res, next) => {
  const results = [];
  const { buffer, originalname } = req.file;

  // Verifica se o arquivo é um CSV
  if (!originalname.endsWith('.csv')) {
    const errorMessage = 'O arquivo enviado não é um arquivo CSV.';
      const result = [{ errorMessage }];
      res.json(result);
  }

  streamifier.createReadStream(buffer)
  .pipe(csv())
  .on('headers', (headers) => {
    // Verifica se o cabeçalho contém as colunas "product_code" e "new_price"
    if (!headers.includes('product_code') || !headers.includes('new_price')) {
      const errorMessage = 'O arquivo CSV enviado não contém as colunas "product_code" e/ou "new_price".';
      const results = { errorMessage };
      res.json(results);
    }
  })
  .on('data', async (data) => {
    // Verifica se o preço é um número válido
    if (isNaN(data.new_price)) {
      data.errorMessage = 'O preço fornecido não é um número válido.';
    }
    results.push(data);
  })
  .on('end', async () => {
    // Se houver uma mensagem de erro, retorna um objeto de resposta com a mensagem de erro
    if (results.some((data) => data.errorMessage)) {
      return res.json(results);
    }

    // Caso contrário, continua com a execução normal
    const validatedResults = results.map(async (data) => {
      const product = await productsModel.getProductByCode(data.product_code);
      if (product[0].length === 0) {
        data.errorMessage = 'Um ou mais produtos não existe(m).';
      } else {
        const validation = validatePrice(product, data.new_price);
        if (validation.error) {
          data.errorMessage = validation.error;
        } else {
          data.validMessage = 'O arquivo foi validado com sucesso! Revise os dados e clique em Atualizar para salvar as alterações.'
        }
      }
      return data;
    });

    const validatedData = await Promise.all(validatedResults);

    if (validatedData.some((data) => data.errorMessage)) {
      return res.json(validatedData);
    }

    req.body = results;
    return res.json(results);
  })
  .on('error', (err) => {
    res.status(400).json({ error: err.message });
  });
};

const validatePrice = (product, newPrice) => {
  const { sales_price, cost_price } = product[0][0];

  const MIN = parseFloat(sales_price * 0.9).toFixed(2);
  const MAX = parseFloat(sales_price * 1.1).toFixed(2);

  if (newPrice < cost_price) return { error: 'O preço de venda não pode ser menor que o preço de custo' };
  if (newPrice > MAX || newPrice < MIN) return { error: 'O preço de venda está fora da variação de 10% permitida' };

  return {};
}

module.exports = { validatePrice, validateFile };
