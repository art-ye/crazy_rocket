const debug = require('debug');
const Redis = require('ioredis');
const config = require('../../config/redis');

const logError = debug('RedisService:error');

class RedisService extends Redis {
  constructor(...args) {
    super(...args);

    this.select(config.db, (err) => {
      if (err) {
        logError('Error during switching DB');
      }
    });
  }

  async getJSON(key) {
    try {
      const data = await this.get(key);
      return JSON.parse(data);
    } catch (e) {
      logError('Error RedisService %o', e);
      return {};
    }
  }
}

module.exports = new RedisService(config);
