const express = require('express');
const authMiddleware = require('../middlewares/checkAuth');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoom.controller');

router.use(authMiddleware.jwtAuthenticate);

router.post('/', chatRoomController.chatRoomPOST);
router.get('/', chatRoomController.chatRoomUSERGET);
router.get('/:id', chatRoomController.chatRoomGET);
router.post('/:id/message', chatRoomController.chatRoomSENDMESSAGE);

module.exports = router;