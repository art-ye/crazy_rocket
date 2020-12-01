const { Model } = require('objection');

const Round = require('./Round');

class Bet extends Model {
  static get tableName() {
    return 'bets';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        round_id: { type: 'integer' },
        user_id: { type: 'integer' },
        user_gender: { type: 'integer' },
        nickname: { type: 'string' },
        amount: { type: 'float' },
        currency: { type: 'string' },
        seed: { type: 'string' },
        is_won: { type: 'boolean' },
        is_billed: { type: 'boolean' },
        is_canceled: { type: 'boolean' },
        auto_cash_out_odd: { type: 'float' },
        cashout_odd: { type: 'float' },
        cashout_time: { type: 'integer' },
        cashout_amount: { type: 'float' },
        token: { type: 'string' },
        transaction_hash: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      round: {
        relation: Model.HasOneRelation,
        modelClass: Round,
        join: {
          from: 'rounds.id',
          to: 'bets.round_id',
        },
      },
    };
  }


  static get modifiers() {
    return {

    };
  }
}

module.exports = Bet;
