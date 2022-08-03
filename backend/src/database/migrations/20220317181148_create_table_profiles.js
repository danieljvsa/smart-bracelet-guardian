
exports.up = function(knex) {
    return knex.schema.createTable('profiles',function(table){
      table.increments('profileId').primary();
      table.string('profileName').notNullable();
      table.string('battery').notNullable();
    })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('profiles');
};
