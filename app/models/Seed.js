const { Model } = require('objection');

class Seed extends Model {
  static get tableName() {
    return 'seeds';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        station: { type: 'string' },
        seeder: { type: 'string' },
        seeder_id: { type: 'integer' },
        seed: { type: 'string' },
      },
    };
  }

  static get modifiers() {
    return {
      selectForView(builder) {
        builder.select('seeder', 'seed');
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}

module.exports = Seed;
