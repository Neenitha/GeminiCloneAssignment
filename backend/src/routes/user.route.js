/** User Routes **/

const express = require('express');
const authMiddleware = require('../middlewares/checkAuth');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.use(authMiddleware.jwtAuthenticate);
router.get('/me', userController.userGET);

module.exports = router;

