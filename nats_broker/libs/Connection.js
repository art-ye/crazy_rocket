const NATS = require('nats');

const nats = NATS.connect({
  url: process.env.NATS_SERVER_URL || 'nats://localhost:4222',
  name: process.env.NATS_CLIENT_NAME || process.env.npm_package_name,
  json: true,
});

nats.instance = NATS;

nats.on('error', (err) => {
  console.log('NATS -> Error:', err);
});

nats.on('reconnecting', (msg) => {
  console.log('NATS -> Reconnecting:', msg);
});

nats.on('disconnect', (msg) => {
  console.log('NATS -> Disconnected:', msg);
});


nats.on('connect', () => {
  console.log('NATS -> Connected...');
});

nats.on('reconnect', (msg) => {
  console.log('NATS -> Reconnected:', msg);
});

module.exports = nats;
