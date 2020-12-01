const { messages } = require('../../../config');

module.exports = (socket, data) => () => {
  const response = {
    data,
    topic: messages.GAME_ODD_UPDATE,
  };
  socket.send(JSON.stringify(response));
};
