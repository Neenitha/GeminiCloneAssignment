/** Database Configurations **/

const { Pool } = require('pg');
const config = require('../config/config');
const rds = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// To connect to local db
/* const pool = new Pool({
  connectionString: config.POSTGRES_URL
}); */

// Connection to AWS DB Instance

// To connect to postgres DB in AWS
const signerOptions = {
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
  region: config.AWS_REGION,
  hostname: config.AWS_DB_HOST,
  port: config.AWS_DB_PORT,
  username: config.AWS_DB_USERNAME,
}

const signer = new rds.Signer(signerOptions);
// const getPassword = () => signer.get;

const pool = new Pool({
  user: signerOptions.username,
  password: 'postgres_123',
  host: signerOptions.hostname,
  port: signerOptions.port,
  database: config.AWS_DB_NAME,
});

pool.on('connect', () => {
  console.log('Connection to db successfull!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
