const Connection = require('./libs/Connection');
const Request = require('./libs/Request');
const Response = require('./libs/Response');

class Broker {
  static async on(route, handler, queue) {
    return Connection.subscribe(route, {
      queue: queue || process.env.npm_package_name,
    }, (data, replyTo, subject) => {
      const req = new Request(subject, data);
      const res = new Response(replyTo);

      handler(req, res);
    });
  }

  static async get(subject, data) {
    return new Promise((resolve, reject) => {
      Connection.requestOne(subject, data, {}, 1000, (response) => {
        if (response instanceof Connection.instance.NatsError) {
          console.warn('Subject ->', subject, 'not processed', response);
          return reject(response);
        }

        return resolve(new Request(subject, response));
      });
    });
  }

  static async push(subject, data) {
    return new Promise((resolve, reject) => {
      Connection.publish(subject, data, (err) => {
        if (err) {
          console.warn('Subject ->', subject, 'not deliverd');
          return reject(err);
        }

        return resolve(1);
      });
    });
  }
}

module.exports = Broker;
