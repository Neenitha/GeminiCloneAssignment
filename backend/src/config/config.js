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
  DAILY_BASIC_PLAN_MESSAGE_LIMIT: joi.string().required(),
  AWS_ACCESS_KEY: joi.string().required(),
  AWS_SECRET_KEY: joi.string().required(),
  AWS_REGION: joi.string().required(),
  AWS_DB_HOST: joi.string().required(),
  AWS_DB_PORT: joi.string().required(),
  AWS_DB_USERNAME: joi.string().required(),
  AWS_DB_NAME: joi.string().required()
}).unknown();

const {value: envVars, error } = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  PORT: envVars.PORT,
  POSTGRES_URL: envVars.POSTGRES_URL,
  JWT_SECRET: envVars.JWT_SECRET,
  GEMINI_MODEL: envVars.GEMINI_MODEL,
  DAILY_BASIC_PLAN_MESSAGE_LIMIT: envVars.DAILY_BASIC_PLAN_MESSAGE_LIMIT,
  AWS_ACCESS_KEY: envVars.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: envVars.AWS_SECRET_KEY,
  AWS_REGION: envVars.AWS_REGION,
  AWS_DB_HOST: envVars.AWS_DB_HOST,
  AWS_DB_PORT: envVars.AWS_DB_PORT,
  AWS_DB_USERNAME: envVars.AWS_DB_USERNAME,
  AWS_DB_NAME: envVars.AWS_DB_NAME
}

module.exports = config;
