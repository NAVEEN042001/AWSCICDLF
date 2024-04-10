const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth.js');
const companyController = require("../controllers/company.js");

router.post("/", auth, companyController.addCompany);
router.get("/",  auth, companyController.readCompany);

module.exports = router;