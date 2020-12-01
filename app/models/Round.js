const { Model } = require('objection');

const Bet = require('./Bet');
const Seed = require('./Seed');
const ServerSeed = require('./ServerSeed');

class Round extends Model {
  static get tableName() {
    return 'rounds';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        station: { type: 'string' },
        sha256_server_seed: { type: 'string' },
        sha512: { type: 'string' },
        is_started: { type: 'boolean' },
        is_crashed: { type: 'boolean' },
        crash_value: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      bets: {
        relation: Model.HasManyRelation,
        modelClass: Bet,
        join: {
          from: 'rounds.id',
          to: 'bets.round_id',
        },
      },
      seeds: {
        relation: Model.HasManyRelation,
        modelClass: Seed,
        join: {
          from: 'rounds.id',
          to: 'seeds.round_id',
        },
      },
      serverSeed: {
        relation: Model.HasOneRelation,
        modelClass: ServerSeed,
        join: {
          from: 'rounds.sha256_server_seed',
          to: 'server_seeds.sha256',
        },
      },
    };
  }
}

module.exports = Round;
