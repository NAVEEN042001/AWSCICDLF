const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth')
const saleController = require("../../controllers/sales");

router.get('/code', auth, saleController.readSaleCode);
router.post("/", auth, saleController.addSales);
router.get("/", auth, saleController.readSales);


module.exports = router;