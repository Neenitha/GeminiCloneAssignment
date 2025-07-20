const nodeCache = require('node-cache');
const httpStatus = require('http-status');

const cache = new nodeCache({ stdTTL: 60, checkperiod: 120 });

async function checkCache( req, res, next ) {
  const key = res.locals.userId;
  const cachedData = cache.get(key);

  if (cachedData) {
    res.status(httpStatus.status.OK).json(cachedData);
  }
  else
  {
    next();
  }
}

module.exports = {
  checkCache,
  cache
}