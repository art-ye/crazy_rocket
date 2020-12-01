const uWS = require('uWebSockets.js');
const debug = require('debug');
const socketService = require('./services/socket.service');
const httpService = require('./services/http.service');

const log = debug('Server');
const error = debug('Server:error');

const port = process.env.APP_PORT || 9002;

const app = uWS./* SSL */App(
  /* {
    key_file_name: 'misc/key.pem',
    cert_file_name: 'misc/cert.pem',
    passphrase: '1234'
  } */
);

httpService(app);
app.ws('/socket', socketService);

app.listen(port, (isConnect) => {
  if (isConnect) {
    log(`Listening to port ${port}`);
  } else {
    error(`Failed to listen to port ${port}`);
  }
});
