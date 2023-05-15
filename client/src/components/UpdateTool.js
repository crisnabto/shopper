import React, { useEffect, useState } from 'react';
import { validateFile, getProductByCode, updatePrice } from '../services/api';
import { CSVLink } from 'react-csv';
import './updateTool.css';

function UpdateTool() {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pack, setPack] = useState([]);
  const [validFile, setValidFile] = useState(false);
  const [validateButtonClick, setValidateButtonClick] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleValidation = async (file) => {
    setUpdatedProduct([]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await validateFile(formData);
      const result = response.data;
      if (result.errorMessage) alert('erro')
      console.log(result);

      setValidFile(!result.find(obj => obj.errorMessage))


      setMessages(result);

      const allPacks = [];
      const allProducts = [];

      // Cria um array de promessas
      const promises = result.map(async (res) => {
        const code = res.product_code;
        const getProduct = await getProductByCode(code);
        console.log(getProduct);
        if (getProduct.message) {
          alert('Um ou mais produtos não existe(m).')
        } else {
          allProducts.push(getProduct[0][0]);
          allPacks.push(getProduct[1]);
        }
      });

      // Aguarda todas as promessas serem resolvidas antes de atualizar o estado
      Promise.all(promises).then(() => {
        setPack(allPacks);
        setProducts(allProducts);
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (validateButtonClick) {
      handleValidation(file);
      setValidateButtonClick(false);
    }
  }, [validateButtonClick]);

  const handleValidationButtonClick = () => {
    setValidateButtonClick(true);
  };

  const handleUpdate = async () => {
    const allUpdates = [];
    for (const prod of messages) {
      const saveToDb = await updatePrice(prod.product_code, Number(prod.new_price));
      if (saveToDb.error) {
        alert('Houve um erro ao salvar as alteracões');
      }
    }
    products.map((prod) => {
      const newProd = {
        code: prod.code,
        name: prod.name,
        cost_price: prod.cost_price,
        new_price: messages.find(obj => obj.product_code === prod.code.toString())?.new_price
      }
      allUpdates.push(newProd);
    })
    setUpdatedProduct(allUpdates);
  };



  return (
    <div>
      <h1>Ferramenta de Edição de Preços</h1>
      <div className='edit-container'>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleValidationButtonClick}>Validar</button>
        <button onClick={handleUpdate} disabled={!validFile}>Atualizar</button>
      </div>

      {messages[0] && updatedProduct.length === 0 ? (
        <p style={{
          borderBottom: messages.find(obj => obj.errorMessage) ? '4px solid red' : '4px solid #36B37E',
          paddingBottom: '3px'
        }}>
          {messages.find(obj => obj.errorMessage)
            ? messages.find(obj => obj.errorMessage).errorMessage + '  🚫'
            : messages.find(obj => obj).validMessage + '  ✅'}
        </p>
      ) : <p style={{
        borderBottom: '4px solid #36B37E',
        paddingBottom: '3px'
      }}>As alterações foram salvas com sucesso!</p>}

      <div>
        {products.length > 0 && updatedProduct.length === 0 && (
          <div>
            <h2>Tabela de Produtos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço de custo</th>
                  <th>Preço de venda</th>
                  <th>Novo Preço</th>
                  <th>Regra quebrada</th>
                </tr>
              </thead>

              <tbody>
                {products.map(p => (
                  <tr key={p.code} style={{ border: messages.find(obj => obj.product_code === p.code.toString())?.errorMessage ? '2px solid red' : 'none' }}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.cost_price}</td>
                    <td>{p.sales_price}</td>
                    {/* <td>{messages[0].new_price}</td> */}
                    <td>
                      {messages.find(obj => obj.product_code === p.code.toString())?.new_price}
                    </td>
                    <td>
                      {messages.find(obj => obj.product_code === p.code.toString())?.errorMessage || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}

        {pack.length > 0 && updatedProduct.length === 0 && (
          <div>
            <h2>Tabela de Packs Relacionados</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço de custo</th>
                  <th>Preço de venda</th>
                  <th>Quantidade</th>
                  <th>Novo Preço do Produto</th>
                  <th>Regra quebrada</th>
                  <th colSpan={pack.length}>Preco atual do Pack</th>
                  <th colSpan={pack.length}>Novo Preço do Pack</th>
                </tr>
              </thead>
              <tbody>

                {pack.map((pac) => (
                  pac.map((p, index) => (
                    <tr key={index}>
                      <td>{p.pack_id}</td>
                      <td>{p.name}</td>
                      <td>{p.cost_price}</td>
                      <td>{p.sales_price}</td>
                      <td>{p.qty}</td>
                      <td>
                        {messages.find(obj => obj.product_code === p.product_id.toString())?.new_price || '-'}
                      </td>
                      <td style={{ border: messages.find(obj => obj.product_code === p.product_id.toString())?.errorMessage ? '2px solid red' : 'none' }}>
                        {messages.find(obj => obj.product_code === p.product_id.toString())?.errorMessage || '-'}
                      </td>

                      {index === 0 && <td rowSpan={pac.length}>{p.total_price}</td>}
                      {index === 0 && <td rowSpan={pac.length}>{p.sales_price * p.qty}</td>}
                    </tr>

                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {updatedProduct.length > 0 && (
        <div>
          <div className='export-csv-container'>
            <CSVLink data={updatedProduct} filename={'price-update.csv'} className='csv-link'>
              Exportar para CSV
            </CSVLink>
          </div>
          {updatedProduct.map((prod) => (
            <div className='product-card' key={prod.code}>
              <p>Código: {prod.code}</p>
              <p>Nome: {prod.name}</p>
              <p>Preço de custo: {prod.cost_price}</p>
              <p>Novo preço de venda atualizado: {prod.new_price}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default UpdateTool;
