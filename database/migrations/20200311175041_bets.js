
exports.up = knex => knex.schema.createTable('bets', (table) => {
  table.increments('id').unsigned().primary();
  table.integer('round_id');
  table.integer('user_id');
  table.string('nickname');
  table.integer('user_gender');
  table.float('amount');
  table.string('currency');
  table.string('seed');
  table.float('auto_cash_out_odd').nullable();
  table.float('cashout_odd').nullable();
  table.bigInteger('cashout_time').nullable();
  table.float('cashout_amount').nullable();
  table.string('token');
  table.boolean('is_won').default(false);
  table.boolean('is_billed').default(false);
  table.boolean('is_canceled').default(false);

  table.timestamps(false, true);
});

exports.down = knex => knex.schema.dropTable('bets');
