const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const sellerRoutes = require('./routes/sellers');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

// simple in-memory or file-based db (lowdb)
require('./db'); // initializes db

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/sellers', sellerRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.send('LakayMarket backend running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
