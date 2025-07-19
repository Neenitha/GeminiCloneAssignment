/** Aunthentication Middlewares **/

const db = require('../config/database');
const tokenUtil = require('../utils/token.util');
const httpStatus = require('http-status');

async function jwtAuthenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      res.status(httpStatus.status.FORBIDDEN).send("Authentication header is missing!");

    const token = header.split("Bearer ")[1];
    if (!token)
      res.status(httpStatus.status.FORBIDDEN).send("Authentication token is missing!");

    const payload = tokenUtil.verifyJwtToken(token);

    if (!payload)
      res.status(httpStatus.status.BAD_REQUEST).send("Invalid authentication Token");

    const userResult = await db.query('SELECT * FROM USERS where user_id = $1', [payload.id]);

    if (!userResult.rowCount)
      res.status(httpStatus.status.BAD_REQUEST).send("User not found!");
    else
      res.locals.userId = payload.id;

    next();
  }
  catch( err ) {
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send(err)
  }
}

module.exports = {
  jwtAuthenticate
}
