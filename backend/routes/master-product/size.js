const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const sizeController = require("../../controllers/master-product/size");

router.post("/", auth, sizeController.addsize);
router.get("/", auth, sizeController.readsize);
router.put("/:id", auth, sizeController.updatesize);
router.delete("/:id", auth, sizeController.deletesize);

module.exports = router;