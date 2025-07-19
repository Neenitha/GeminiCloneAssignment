const db = require('../config/database');
const httpStatus = require('http-status');
const config = require('../config/config');
const genAI = require('@google/genai');

const SUBSCRIPTION_TIER_PRO = 'Pro';
const SUBSCRIPTION_TIER_BASIC = 'Basic';

// Create a chat room
const chatRoomPOST = async (req, res, next) => {
  try {
    const { receiver_id, chatroom_name } = req.body;
    const response = await db.query('INSERT INTO CHATROOM(user_id, receiver_id, chatroom_name) values ($1, $2, $3)',
      [parseInt(res.locals.userId), receiver_id, chatroom_name]);

    res.status(httpStatus.status.CREATED).send(`Inserted ${response.rowCount} record(s)`);
  }
  catch (err) {
    next(err);
  }
}

// Get chat room of the user logged in
const chatRoomUSERGET = async (req, res, next) => {
  try {
    const chatRoomsResult = await db.query('SELECT f.username AS creator_name, f.chatroom_name AS chatroom_name, r.username AS receiver_name FROM (SELECT u.userName AS username, c.chatroom_name, c.receiver_id  FROM chatroom c JOIN users u ON u.user_id = c.user_id WHERE u.user_id = $1) AS f LEFT JOIN users r ON f.receiver_id = r.user_id', [parseInt(res.locals.userId)]);

    if (chatRoomsResult.rowCount)
      res.status(httpStatus.status.OK).send(chatRoomsResult.rows);
    else
      res.status(httpStatus.status.NOT_FOUND).send(`No chat rooms found for the user!`);
  }
  catch (err) {
    next(err);
  }
}

// Gete details of a chat room
const chatRoomGET = async (req, res, next) => {
  try {
    const chatRoomsResult = await db.query('SELECT f.username AS creator_name, f.chatroom_name AS chatroom_name, r.username AS receiver_name FROM (SELECT u.userName AS username, c.chatroom_name, c.receiver_id  FROM chatroom c JOIN users u ON u.user_id = c.user_id WHERE c.chatroom_id = $1) AS f LEFT JOIN users r ON f.receiver_id = r.user_id', [parseInt(req.params.id)]);

    if (chatRoomsResult.rowCount)
      res.status(httpStatus.status.OK).send(chatRoomsResult.rows[0]);
    else
      res.status(httpStatus.status.NOT_FOUND).send(`Chat room does not exist!`);
  }
  catch (err) {
    next(err);
  }
}

const chatRoomSENDMESSAGE = async (req, res, next) => {
  try {
    const chatRoomResult = await db.query('SELECT * FROM chatroom WHERE chatroom_id = $1', [req.params.id]);
    if (chatRoomResult.rowCount) {
      var chatRoom = chatRoomResult.rows[0]
    }
    else
      res.status(httpStatus.status.BAD_REQUEST).send(`Chat room does not exist!`);

    // Connect to gemini ai
    const ai = new genAI.GoogleGenAI({});

    const geminiResponse = await ai.models.generateContent({
      model: config.GEMINI_MODEL,
      contents: req.body.message
    })

    // Check the daily message count and send the ai response back only if the 
    // count is within the limits
    const userResult = await db.query('SELECT * FROM USERS where user_id = $1', [parseInt(res.locals.userId)]);
    if (userResult.rows.length) {
      user = userResult.rows[0];
      const msgResult = await db.query('SELECT * FROM MESSAGES where user_id = $1', [parseInt(res.locals.userId)]);

      if (msgResult.rowCount) {
        if (user.subscription_tier == SUBSCRIPTION_TIER_BASIC || user.subscription_tier == null) {
          let messageInfo = msgResult.rows[0];
          let last_msg_date = (new Date(messageInfo.last_msg_dt)).toISOString().split('T')[0];
          let now = (new Date()).toISOString().split('T')[0];
          let count = messageInfo.msg_count_day;

          if (last_msg_date == now && count >= parseInt(config.DAILY_BASIC_PLAN_MESSAGE_LIMIT))
            res.status(httpStatus.status.OK).send("Your daily message limit exceeded! Please upgrade to Pro!");
          else {
            count = count + 1;

            const response = await db.query('UPDATE MESSAGES SET last_msg_dt = $2, msg_count_day = $3 where user_id = $1', [parseInt(res.locals.userId), new Date(), count]);
            if (!response.rowCount)
              console.error("Could not update message statistics!");
          }
        }

        res.status(httpStatus.status.OK).send(geminiResponse.text);
      }
      else {
        const response = await db.query('INSERT INTO MESSAGES(user_id, receiver_id, last_msg_dt, msg_count_day) values ($1, $2, $3, $4)',
          [parseInt(res.locals.userId), chatRoom.receiver_id, new Date(), 1]);
        if (!response.rowCount)
          console.error("Could not update message statistics!");
      }
    }
    else
          res.status(httpStatus.status.NOT_FOUND).send(`User does not exist!`);
  }
  catch (err) {
    next(err);
  }
}

module.exports = {
  chatRoomPOST,
  chatRoomUSERGET,
  chatRoomGET,
  chatRoomSENDMESSAGE
}