const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require("../controllers/user");

router.get("/", auth, userController.readUser);
router.get("/user-code", auth, userController.readUserCode);
router.get("/loggedin", auth, userController.readLoggedinUser);
router.post("/", auth, userController.addUser);

module.exports = router;