const express = require('express');
const app = express();
const cors = require('cors');
const products = require('./routes/products');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', products);

app.listen(3000, () => {
  console.log('server is running')
})