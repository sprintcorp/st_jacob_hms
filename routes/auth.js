const express = require("express");
const upload = require("../utils/multer");
const { register, login, logout, getMe, updateDetails, updatePassword, getUser, forgotPassword, resetPassword } = require('../controller/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();
const User = require('../model/User');
const advancedResults = require('../middleware/advancedResults');

router.post('/register', register);
router.get('/users', advancedResults(User), getUser);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single("image"), updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;