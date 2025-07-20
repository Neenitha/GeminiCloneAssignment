/** Chatroom Routes **/

const express = require('express');
const authMiddleware = require('../middlewares/checkAuth');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoom.controller');
const cacheMiddleware = require('../middlewares/checkCache');

router.use(authMiddleware.jwtAuthenticate);

router.post('/', chatRoomController.chatRoomPOST);
router.get('/:id', chatRoomController.chatRoomGET);
router.post('/:id/message', chatRoomController.chatRoomSENDMESSAGE);

router.get('/', cacheMiddleware.checkCache, chatRoomController.chatRoomUSERGET);

module.exports = router;
