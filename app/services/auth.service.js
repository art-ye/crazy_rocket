const moment = require('moment');
const crypto = require('crypto');
const querystring = require('querystring');

const { ResponseGenerator, ErrorHandler, Helpers } = require('./index');

class AuthService {
  static checkTimestamp(timestamp) {
    try {
      if (timestamp) {
        const currentTimestamp = moment().format('YYYYMMDDHHmmssSSS');
        const difference = currentTimestamp - timestamp;
        return timestamp.length === 17 && difference < 20000;
      }

      return false;
    } catch (error) {
      console.log('AuthService/checkTimestamp Error: ', error);
      return false;
    }
  }

  static checkNonce(nonce) {
    try {
      return nonce ? nonce.match('^[a-fA-F0-9]{40}$') : false;
    } catch (error) {
      console.log('AuthService/checkNonce Error: ', error);
      return false;
    }
  }

  static async checkValidity(req) {
    try {
      const { headers, body } = req;

      const playServiceId = headers['x-play-service-id'];
      const nonce = AuthService.checkNonce(headers['x-ps-nonce']);
      const timestamp = AuthService.checkTimestamp(headers['x-ps-timestamp']);
      const sign = headers['x-ps-sign'];
      if (!playServiceId) {
        return ErrorHandler.handle(2);
      }

      if (!nonce) {
        return ErrorHandler.handle(3);
      }

      // if (!timestamp) { // TODO time validity is off
      //     return ErrorHandler.handle(4);
      // }

      const client = await ClientMysqlModule.checkClient({ play_service_id: playServiceId });
      if (!client[0]) {
        return ErrorHandler.handle(6);
      }
      const merchantKey = client[0].merchant_key;
      const authHeaders = {
        'x-play-service-id': headers['x-play-service-id'],
        'x-ps-timestamp': headers['x-ps-timestamp'],
        'x-ps-nonce': headers['x-ps-nonce'],
      };
      const createdSign = Helpers.generateSign(authHeaders, body, merchantKey);
      console.log({ createdSign });
      return createdSign === sign ? ResponseGenerator.generate(1) : ErrorHandler.handle(5);
    } catch (error) {
      console.log('AuthService/checkValidity Error: ', error);
      return ErrorHandler.handle(1);
    }
  }

  static generateSign(headers, body, merchantKey) {
    const merged = { ...headers, ...body };
    // eslint-disable-next-line no-undef
    const sorted = _(merged).toPairs().sortBy(0).fromPairs()
      .value();
    const urlEncodedString = querystring.stringify(sorted);
    return crypto.createHmac('sha1', merchantKey).update(urlEncodedString).digest('hex');
  }
}

module.exports = AuthService;
