const debug = require('debug');
const { CHAT_NEW_MESSAGE } = require('../../config/messages');
const { GET_CHAT_HISTORY } = require('../../config/messages');
const handlers = require('../handlers');
const log = debug('messageService');
const errorLog = debug('messageService:error');


const callSocketHandler = (title, socket, ...args) => {
  if (!handlers[title]) {
    console.error('Handler Not found', title);
    throw new Error('Handler not defined!');
  } 
  return handlers[title](socket, ...args);
};

module.exports = (ws, {topic,data}) => {
  switch (topic) {
    case CHAT_NEW_MESSAGE: 
    callSocketHandler('CHAT_NEW_MESSAGE', ws, data)();
      break;

    case GET_CHAT_HISTORY:
      callSocketHandler('GET_CHAT_HISTORY', ws, data)();
      break;

    default:
      break;
  }
};
