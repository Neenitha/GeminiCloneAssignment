/** Authentication API Controllers **/

const db = require('../config/database');
const httpStatus = require('http-status');
const otpUtil = require('../utils/otp.util');
const { createJWTToken } = require('../utils/token.util');

// Sign up user
const authSIGNUP = async (req, res, next) => {
  try {
    const { first_name, last_name, email, mobile_number, userName, password} = req.body;
    const response = await db.query('INSERT INTO USERS(first_name, last_name, email, mobile_number, userName, password, subscription_tier) values ($1, $2, $3, $4, $5, $6, $7)', 
      [first_name, last_name, email, mobile_number, userName, password, 'Basic']);
    
    res.status(httpStatus.status.CREATED).send(`Inserted ${response.rowCount} record(s)`);
  }
  catch (err) {
    next(err);
  }
}

// Send otp
const authSENDOTP = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT COUNT(*) FROM USERS where mobile_number = $1', [req.body.mobile_number]);

    if (userResult.rows[0].count == 1) {
      let otp = otpUtil.generateOtp(6);

      const response = await db.query('UPDATE USERS SET otp = $2 where mobile_number = $1', [req.body.mobile_number, parseInt(otp)]);
      if (response.rowCount)
        res.status(httpStatus.status.OK).send({otp: otp});
      else
        res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('Could not generate otp');
    }
    else
      res.status(httpStatus.status.NOT_FOUND).send(`User with the provided mobile number does not exist!`);
  }
  catch (err) {
    next(err);
  }
}

// Verify OTP entered
const authVERIFYOTP = async ( req, res) => {
  try {
    const userResult = await db.query('SELECT * FROM USERS where mobile_number = $1', [req.body.mobile_number]);
    const user = userResult.rows[0];

    if (user.otp == parseInt(req.body.otp))
    {
      const token = createJWTToken({ id: user.user_id, mobile_number: user.mobile_number});

      const response = await db.query('UPDATE USERS SET otp = null where mobile_number = $1', [req.body.mobile_number]);
      if (response.rowCount)
        res.status(httpStatus.status.OK).send({ jwtToken: token});
      else
        res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('could not complete otp verification');
    }
    else
    res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('Incorrect otp entered!');
  }
  catch (err) {
    next(err);
  }
}

// Send OTP to proceed with change password
const authFORGOTPASSWORD = async ( req, res) => {
  try {
    const userResult = await db.query('SELECT * FROM USERS where mobile_number = $1', [req.body.mobile_number]);

    if (userResult.rows.length) {
      let user = userResult.rows[0];
      let otp = otpUtil.generateOtp(6);

      const response = await db.query('UPDATE USERS SET otp = $2 where user_id = $1', [user.user_id, parseInt(otp)]);

      if (response.rowCount)
        res.status(httpStatus.status.OK).send({otp: otp});
      else
        res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('could not reset password');
    }
    else
      res.status(httpStatus.status.NOT_FOUND).send(`User does not exist!`);
  }
  catch (err) {
    next(err);
  }
}

// Change the password. Currently password is not encrypted
// TO DO: Password Encryption
const authCHANGEPASSWORD = async ( req, res, next) => {
  try {
    const userResult = await db.query('SELECT * FROM USERS where user_id = $1', [parseInt(res.locals.userId)]);

    if (userResult.rows.length) {
      user = userResult.rows[0];
      if (user.password === req.body.old_password) {
        const response = await db.query('UPDATE USERS SET password = $2 where user_id = $1', [user.user_id, req.body.new_password]);
        if (response.rowCount)
          res.status(httpStatus.status.OK).send('Password changed successfully!');
        else
          res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('could not reset password');
      }
      else
        res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('Incorrect current password!');
    }
    else
      res.status(httpStatus.status.NOT_FOUND).send(`User does not exist!`);
  }
  catch (err) {
    next(err);
  }
}


module.exports = {
  authSIGNUP,
  authSENDOTP,
  authVERIFYOTP,
  authFORGOTPASSWORD,
  authCHANGEPASSWORD
}
