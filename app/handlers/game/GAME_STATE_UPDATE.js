const { messages } = require('../../../config');
const getState = require('../../helpers/station');

module.exports = async (socket, pipedData) => {
  let data = {};
  if (!pipedData) {
    data = await getState();
  } else {
    data = pipedData;
  }

  const response = {
    data,
    topic: messages.GAME_STATE_UPDATE,
  };

  socket.send(JSON.stringify(response));
};
