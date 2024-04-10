const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const itemController = require("../../controllers/master-product/item");

router.post("/", auth, itemController.additem);
router.get("/", auth, itemController.readitem);
router.get("/itemLabel", auth, itemController.readItemLabel);
router.get("/code", auth, itemController.readcode);
router.put("/:id", auth, itemController.updateitem);
router.delete("/:id", auth, itemController.deleteitem);

module.exports = router;