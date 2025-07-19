/** Environment Configurations **/

const dotenv = require('dotenv');
const joi = require('joi');

dotenv.config();

const envVarsSchema = joi.object().keys({
  NODE_ENV: joi.string().valid('development').required(),
  POSTGRES_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  GEMINI_API_KEY: joi.string().required(),
  GEMINI_MODEL: joi.string().required(),
  DAILY_BASIC_PLAN_MESSAGE_LIMIT: joi.string().required()
}).unknown();

const {value: envVars, error } = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  PORT: process.env.PORT,
  POSTGRES_URL: process.env.POSTGRES_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  DAILY_BASIC_PLAN_MESSAGE_LIMIT: process.env.DAILY_BASIC_PLAN_MESSAGE_LIMIT
}
