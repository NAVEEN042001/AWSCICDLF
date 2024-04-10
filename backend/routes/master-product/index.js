const express = require("express");
const router = express.Router();

const brandRoutes = require("./brand");
const itemRoutes = require("./item");
const sizeRoutes = require("./size");
const sleevetypeRoutes = require("./sleeve-type");
const colourRoutes = require("./color");

router.use("/brand", brandRoutes);
router.use("/item", itemRoutes);
router.use("/size", sizeRoutes);
router.use("/sleeve-type", sleevetypeRoutes);
router.use("/color", colourRoutes);

module.exports = router;


