const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/checkAuth');

const authController = require('../controllers/auth.controller');

router.post('/signup', authController.authSIGNUP);
router.post('/send-otp', authController.authSENDOTP);
router.post('/verify-otp', authController.authVERIFYOTP);
router.post('/forgot-password', authController.authFORGOTPASSWORD);

router.use(authMiddleware.jwtAuthenticate);

router.post('/change-password', authController.authCHANGEPASSWORD);

module.exports = router;