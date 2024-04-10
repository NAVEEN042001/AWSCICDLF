const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const sleeveTypeController = require("../../controllers/master-product/sleeve-type");

router.post("/", auth, sleeveTypeController.addSleeveType);
router.get("/", auth, sleeveTypeController.readSleeveType);
router.put("/:id", auth, sleeveTypeController.updateSleeveType);
router.delete("/:id", auth, sleeveTypeController.deleteSleeveType);

module.exports = router;