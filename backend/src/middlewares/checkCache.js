const nodeCache = require('node-cache');
const httpStatus = require('http-status');
const config = require('../config/config');

const cache = new nodeCache({ stdTTL: config.NODE_CACHE_TTL, checkperiod: 120 });

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