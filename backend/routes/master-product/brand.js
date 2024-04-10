const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const brandController = require("../../controllers/master-product/brand");

router.post("/", auth, brandController.addbrand);
router.get("/", auth, brandController.readbrand);
router.put("/:id", auth, brandController.updatebrand);
router.delete("/:id", auth, brandController.deletebrand);

module.exports = router;