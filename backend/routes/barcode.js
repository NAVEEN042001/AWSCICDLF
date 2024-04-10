const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const barcodeController = require("../controllers/barcode");

router.post("/", auth, barcodeController.addbarcode);
router.get("/", auth, barcodeController.readbarcode);

module.exports = router;