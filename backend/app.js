// const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
require('./db')(app);
// const axios = require('axios');

const crypto = require('crypto');

// Generate a random hexadecimal string
const randomHex = crypto.randomBytes(16).toString('hex');
// console.log(randomHex);

const masterProductRoutes = require('./routes/master-product/index');
const companyRoutes = require('./routes/company')
const purchaseRoutes = require('./routes/purchase')
const stockRoutes = require('./routes/stock');
const authRoutes = require('./routes/auth');
const saleRoutes = require('./routes/sales/sales')
const barcodeRoutes = require('./routes/barcode')
const errorHandler = require('./middleware/error-handling/error');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/master-product', masterProductRoutes);
app.use('/api/company',companyRoutes)
app.use('/api/purchase',purchaseRoutes)
app.use('/api/company',companyRoutes);
app.use('/api/user', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/sales/sales',saleRoutes)
app.use('/api/barcode',barcodeRoutes)

app.use(errorHandler);

module.exports = app;