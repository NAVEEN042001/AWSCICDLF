const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const stockController = require('../controllers/stock');

router.get('/', auth, stockController.readStock);


module.exports = router;