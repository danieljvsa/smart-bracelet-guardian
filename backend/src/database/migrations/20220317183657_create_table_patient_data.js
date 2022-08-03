
exports.up = async function(knex) {
  await knex.schema.createTable('patient_data',function(table){
      table.increments('dataId').primary();
      table.string('distance').notNullable();
      table.string('address').notNullable();
      table.timestamp('created_at').notNullable();
      table.integer('profileId').unsigned().index().references('profileId').inTable('profiles');
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('patient_data');
};
