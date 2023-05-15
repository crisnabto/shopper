const connection = require('./connection');

const getAllProducts = async () => {
  const [result] = await connection.execute(
    'SELECT * FROM shopper_prices_tool.products',
  );
  return result;
};

const getProductByCode = async (productCode) => {
  const [product] = await connection.execute(
    `SELECT * FROM shopper_prices_tool.products WHERE code = ?
		`,
    [productCode],
  );

  const [[packs]] = await connection.execute(
    'SELECT * FROM shopper_prices_tool.packs WHERE product_id = ?',
    [productCode],
  )
  if (!packs) return [product, []];
  const packId = packs.pack_id;
  const [pack] = await connection.execute(
    // 'SELECT * FROM shopper_prices_tool.packs WHERE pack_id = ?',
    `SELECT *
    FROM shopper_prices_tool.packs pk
    INNER JOIN shopper_prices_tool.products p ON p.code = pk.product_id
    WHERE pk.pack_id = ?`,
    [packId]
  )

  const result = [product, pack];
  return result;
}

const updatePrice = async (productCode, newPrice) => {
  await connection.execute(
    'UPDATE shopper_prices_tool.products SET sales_price = ? WHERE code = ?',
    [newPrice, productCode],
  );
  return productCode;
}

module.exports = { getAllProducts, getProductByCode, updatePrice };
