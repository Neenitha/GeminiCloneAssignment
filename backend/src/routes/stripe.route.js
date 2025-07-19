/** Stripe Routes **/

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/checkAuth');
const stripeController = require('../controllers/stripe.controller');

router.use(authMiddleware.jwtAuthenticate);

router.post('/pro', stripeController.subscribePRO);
router.get('/status/:id', stripeController.subscribeSTATUS);

module.exports = router;
