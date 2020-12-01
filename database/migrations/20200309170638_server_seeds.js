
exports.up = knex => knex.schema.createTable('server_seeds', (table) => {
  table.increments('id').unsigned().primary();
  table.string('sha256');
  table.string('hash');
  table.boolean('is_used').default(false);

  table.timestamps(true);
});

exports.down = knex => knex.schema.dropTable('server_seeds');
