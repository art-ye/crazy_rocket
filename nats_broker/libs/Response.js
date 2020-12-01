const Connection = require('./Connection');

class Response {
  constructor(replyTo) {
    this.replyTo = replyTo;
  }

  send(data) {
    if (!this.replyTo) {
      console.warn('Request doesn\'t wait for reply.');
      return;
    }

    Connection.publish(this.replyTo, data);
  }
}

module.exports = Response;
