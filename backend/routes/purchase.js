const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const purchaseController = require("../controllers/purchase");

router.post("/", auth, purchaseController.addpurcase);
router.get("/", auth, purchaseController.readpurchase);
router.put("/:id", auth, purchaseController.updatepurchase);
router.delete("/:id", auth, purchaseController.deletepurchase);

module.exports = router;