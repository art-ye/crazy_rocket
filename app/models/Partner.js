const { Model } = require('objection');

class Partner extends Model {
  static get tableName() {
    return 'partners';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        partner_id: { type: 'integer' },
        station: { type: 'string' },
        active: { type: 'boolean' },
      },
    };
  }
}

module.exports = Partner;
