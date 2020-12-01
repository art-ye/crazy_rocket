const redis = require('../../services/redis.service');
const { CHAT_NEW_MESSAGE } = require('../../../config/messages');


module.exports =  (socket, data, station) => async () => {
  try { 
    await redis.lpush("chat_12", JSON.stringify(data));
    await redis.ltrim('chat_12', 0, 2);
    const response = {
      data,
      topic: CHAT_NEW_MESSAGE,
  };
  socket.send(station, JSON.stringify(response));

} catch (error) {
console.log('error');
}
};
 