import React, { useEffect, useState } from 'react';
import { validateFile, getProductByCode } from '../services/api';

function UpdateTool() {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pack, setPack] = useState([]);
  const [validFile, setValidFile] = useState(false);
  // const [validate, setValidate] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleValidation = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await validateFile(formData);
      const result = response.data;
      setMessages(result);
      if (result[0].validMessage) {
        setValidFile(true);
      } else {
        setValidFile(false);
      }
      const code = (result[0].product_code);
      const getProduct = await getProductByCode(code);
      setProducts(getProduct[0]);
      setPack(getProduct[1]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (file) {
      handleValidation(file);
    }
  }, [file]);

  const handleUpdate = () => {

  }

  return (
    <div>
      <h1>Validação de Preços</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => handleValidation(file)}>Validar</button>
      <button onClick={handleUpdate} disabled={!validFile}>Atualizar</button>
      {/* {validFile && ( */}
        <div>
          {products.length > 0 && (
            <table>
              <caption>Tabela de Produtos</caption>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Preço de custo</th>
                  <th>Preço de venda</th>
                  <th>Novo Preço</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.code}>
                    <td>{products[0].code}</td>
                    <td>{products[0].name}</td>
                    <td>{products[0].cost_price}</td>
                    <td>{products[0].sales_price}</td>
                    <td>{messages[0].new_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        {pack.length > 0 && (
          <table>
            <caption>Tabela de Packs</caption>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço de custo</th>
                <th>Preço de venda</th>
                <th>Novo Preço</th>
              </tr>
            </thead>
            <tbody>
              {pack.map(p => (
                <tr key={p.code}>
                  <td>{p.pack_id}</td>
                  <td>{p.name}</td>
                  <td>{p.cost_price}</td>
                  <td>{p.sales_price}</td>
                  {p.product_id.toString() === messages[0].product_code.toString() ? <td>{messages[0].new_price}</td> : <td>{p.sales_price}</td>}
                </tr>
              ))}
            </tbody>
          </table>

        )}
        </div>

      {/* )} */}
      {messages[0] && <p>{messages[0].errorMessage}</p>}
      {messages[0] && <p>{messages[0].validMessage}</p>}
    </div>
  )
}

export default UpdateTool;
