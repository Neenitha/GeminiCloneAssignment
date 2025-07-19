/** User API Controllers **/

const db = require("../config/database");
const httpStatus = require('http-status');

// Get details of a user
const userGET = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT * FROM USERS WHERE user_id = $1', [parseInt(res.locals.userId)]);
    if (userResult.rows.length)
      res.status(httpStatus.status.OK).send(userResult.rows[0]);
    else
      res.status(httpStatus.status.NOT_FOUND).send(`User does not exist!`);
  }
  catch (err) {
    next(err);
  }
}

module.exports = {
  userGET,
}
