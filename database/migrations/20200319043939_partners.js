
exports.up = knex => knex.schema.createTable('partners', (table) => {
  table.increments('id').unsigned().primary();
  table.integer('partner_id');
  table.string('name').nullable();
  table.string('station').default('global');
  table.boolean('active').default(true);

  table.timestamps(false, true);
});

exports.down = knex => knex.schema.dropTable('partners');
