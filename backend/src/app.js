const express = require('express');
const { Pool } = require('pg');
const morgan = require('morgan');
const httpStatus = require('http-status');

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const chatRoomRoute = require('./routes/chatRoom.route');
const stripeRoute = require('./routes/stripe.route');

// Create an instance of the Express application
const app = express();



// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));

// global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send(err.message)
});

app.use('/user/', userRoute);
app.use('/auth/', authRoute);
app.use('/chatRoom/', chatRoomRoute);
app.use('/subscribe/', stripeRoute);

// Home Page
app.get('/', (req, res) => {
  res.send('<h1> Welcome to Gemini Clone! </p>');
});


module.exports = app;
