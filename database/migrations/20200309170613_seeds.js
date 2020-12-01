exports.up = knex => knex.schema.createTable('seeds', (table) => {
  table.increments('id').unsigned().primary();
  table.integer('round_id');
  table.integer('seeder_id');
  table.string('seeder');
  table.string('seed');

  table.timestamps(true);
});

exports.down = knex => knex.schema.dropTable('seeds');
