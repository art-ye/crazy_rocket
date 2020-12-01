const debug = require('debug');
const { init } = require('../app');
const registerOnMessageHandler = require('./message.service');

const log = debug('uWebsocket');
const logError = debug('uWebsocket:error');

const onOpen = (ws, request) => {
  log('Socket connected');
  // const headers = Object.fromEntries(new URLSearchParams(request.getHeader()));
  // const query = Object.fromEntries(new URLSearchParams(request.getQuery()));
  // console.log(headers, query);
  init(ws);
};

const onMessage = (ws, message, isBinary) => {
  try {
    const utfMessage = Buffer.from(message).toString('utf8');
    const data = JSON.parse(utfMessage);
    registerOnMessageHandler(ws,data);
  } catch (error) {
    logError('Error is %o', error);
  }
};

const onClose = (ws, code, message) => {
  log('%o %d %s', ws, code, message);
};

const onDrain = (ws) => {
  log('BackPressure %d', ws.getBufferedAmount());
};

module.exports = {
  open: onOpen,
  message: onMessage,
  close: onClose,
  drain: onDrain,
};
