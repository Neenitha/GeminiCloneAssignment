const jwt = require('jsonwebtoken');
const config = require('../config/config');

function createJWTToken( payload ) {
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "12h"});
  return token;
}

function verifyJwtToken( token ) {
  const payload = jwt.verify(token, config.JWT_SECRET);
  return payload;
}

module.exports = {
  createJWTToken,
  verifyJwtToken
}