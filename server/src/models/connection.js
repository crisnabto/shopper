require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const sqlFilePath = path.resolve(__dirname, '../data/database.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf-8');

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  port: process.env.MYSQL_PORT || 3306,
});

async function connect() {
  try {
    console.log('Conectado ao banco de dados MySQL com sucesso!');

    const dropDB = 'DROP DATABASE IF EXISTS shopper_prices_tool';

    const createDatabase = `
    CREATE DATABASE IF NOT EXISTS shopper_prices_tool;`;

    const useDataBaseQuery = 'USE shopper_prices_tool';

    await connection.execute(dropDB);

    await connection.execute(createDatabase);

    await connection.query(useDataBaseQuery);

    const queryRegex = /(?:[^"';]+|"[^"]*"|'[^']*')+/g;
    const queries = sqlScript.match(queryRegex);

    for (const query of queries) {
      try {
        await connection.query(query);
      } catch (error) {
        console.error(`Erro ao executar query: ${query}\n`, error);
      }
    }

    console.log('Script SQL executado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados: ' + error.stack);
  }
}

connect();

module.exports = connection;
