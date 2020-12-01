const debug = require('debug');
const broker = require('../../nats_broker');

const logError = debug('StateService:error');

const states = {};
broker.on('station.*.stateUpdate', (req) => {
  const { subject, body } = req;
  const stationName = subject.replace('station.', '').replace('.stateUpdate', '');

  states[stationName] = body;
});

const getState = (stationName) => {
  const state = states[stationName];

  if (state) {
    return state;
  }

  return broker.get(`station.${stationName}.getState`)
    .then(res => res.body)
    .catch((error) => {
      logError('Cant retrieve %s station state', stationName, error);
      return getState(stationName);
    });
};


module.exports = stationName => getState(stationName);
