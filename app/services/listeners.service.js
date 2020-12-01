const broker = require('../../nats_broker');
const handlers = require('../handlers');

const callSocketHandler = (title, socket, ...args) => {
  if (!handlers[title]) {
    console.error('Socket Handler Not Found', title);
    throw new Error('Handler not defined!');
  }

  return handlers[title](socket, ...args);
};

const onOddUpdate = (req, socket) => {
  callSocketHandler('GAME_ODD_UPDATE', socket, req.body)();
};

const onStateUpdate = (req, socket) => {
  callSocketHandler('GAME_STATE_UPDATE', socket, req.body)();
};

module.exports = (socket, station, partnerId) => {
  broker.on(
    `station.${station}.stateUpdate`,
    req => onStateUpdate(req, socket),
    `ROCKET-LISTENER-${partnerId}`,
  );
  broker.on(
    `station.${station}.oddUpdate`,
    req => onOddUpdate(req, socket),
    `ROCKET-LISTENER-${partnerId}`,
  );
};
