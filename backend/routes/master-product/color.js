const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const colorController = require("../../controllers/master-product/color");

router.post("/", auth, colorController.addcolor);
router.get("/", auth, colorController.readcolor);
router.get("/code", auth, colorController.readcode);
router.put("/:id", auth, colorController.updatecolor);
router.delete("/:id", auth, colorController.deletecolor);

module.exports = router;