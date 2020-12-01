const redis = require('../../services/redis.service');
const { GET_CHAT_HISTORY } = require('../../../config/messages');


module.exports =  (socket, data) => async () => {
  try {
    const data = await redis.lrange('chat_12', 0, -1);
    const messages = data.map(item => JSON.parse(item));
    const response = {
            data: 'ok bro',
            topic: GET_CHAT_HISTORY,
      };
      socket.send(JSON.stringify(response));    


} catch (error) {
        console.error(error);
}
};