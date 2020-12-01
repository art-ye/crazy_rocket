
exports.up = knex => knex.schema.createTable('rounds', (table) => {
  table.increments('id').unsigned().primary();
  table.bigInteger('launch_time');
  table.string('station');
  table.boolean('is_started').default(false);
  table.boolean('is_crashed').default(false);
  table.string('crash_value').nullable();
  table.string('sha512').nullable();
  table.string('sha256_server_seed');

  table.timestamps(true);
});

exports.down = knex => knex.schema.dropTable('rounds');
