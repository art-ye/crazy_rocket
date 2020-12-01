
const debug = require('debug');
const Partner = require('./models/Partner');
const registerListeners = require('./services/listeners.service');

const log = debug('app');
const error = debug('app:error');

exports.init = async (socket) => {
  try {
    const activePartners = await Partner.query().where('active', true);
    activePartners.forEach((item) => {
      log('Initiating game for %s', item.name);
      registerListeners(socket, item.station, item.partner_id);
    });
  } catch (e) {
    error('%s', e.stack);
  }
};
