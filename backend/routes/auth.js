const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/auth');

router.post("/login", userController.userLogin);
router.post('/renew-token', userController.renewToken);
// router.put('/changePassword', auth, userController.changePassword);
router.get("/logout", userController.userLogout);

module.exports = router;