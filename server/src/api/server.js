require('dotenv').config();

const port = process.env.API_PORT || 3001;
const app = require('./app');

app.listen(port);
console.log(`Server running on port ${port}`);
