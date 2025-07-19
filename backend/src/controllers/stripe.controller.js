const db = require('../config/database');
const httpStatus = require('http-status');
const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');

const SUBSCRIPTION_TIER_PRO = 'Pro';

const subscribePRO = async (req, res, next) => {
  try {
    // Commenting code as of now as the stripe API key generation is not successfull.
    /* stripe.products.create({
      name: 'Starter Subscription',
      description: '$12/Month subscription',
    }).then(product => {
      stripe.prices.create({
        unit_amount: 1200,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
      }).then(price => {
        console.log('Success! Here is your starter subscription product id: ' + product.id);
        console.log('Success! Here is your starter subscription price id: ' + price.id);
      });
    }); */

    // update subscription type to PRO for authenticated user
    const response = await db.query('UPDATE USERS SET subscription_tier = $2 where user_id = $1', [parseInt(res.locals.userId), SUBSCRIPTION_TIER_PRO]);
    if (response.rowCount)
      res.status(httpStatus.status.OK).send('Stripe Pro subscription successfull');
    else
      res.status(httpStatus.status.INTERNAL_SERVER_ERROR).send('Could not complete Strip Pro subscription');
  }
  catch (err) {
    next(err);
  }
}

const subscribeSTATUS = async (req, res, next) => {
  try {
    const userResult = await db.query('SELECT subscription_tier FROM USERS where user_id = $1', [parseInt(res.locals.userId)]);
    if (userResult.rowCount)
      res.status(httpStatus.status.OK).send({subscription_tier: userResult.rows[0].subscription_tier});
    else
      res.status(httpStatus.status.NOT_FOUND).send('Invalid User!');
  }
  catch (err) {
    next(err);
  }
}

module.exports = {
  subscribePRO,
  subscribeSTATUS,
}