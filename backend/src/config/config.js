const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  POSTGRES_URL: process.env.POSTGRES_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  DAILY_BASIC_PLAN_MESSAGE_LIMIT: process.env.DAILY_BASIC_PLAN_MESSAGE_LIMIT
}