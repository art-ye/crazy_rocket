const redis = require('../services/redis.service');

exports.getChatHistory = async (res, req) => {
  res.writeHead('content-type', 'application/json');
  if (!res.aborted) {
    res.end();
  }
};
