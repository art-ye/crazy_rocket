const { Model } = require('objection');

class ServerSeed extends Model {
  static get tableName() {
    return 'server_seeds';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [ 'sha256', 'hash' ],

      properties: {
        id: { type: 'integer' },
        sha256: { type: 'string' },
        hash: { type: 'string' },
      },
    };
  }
}

module.exports = ServerSeed;
