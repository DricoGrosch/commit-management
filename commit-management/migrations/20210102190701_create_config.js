
exports.up = async function(knex) {
    await knex.schema.createTable('config', table => {
        table.increments('id').primary();
        table.string('accessToken').notNullable();
        table.string('repositoriesFolder').notNullable();
        table.string('useRemoteDataProvider').notNullable();
        table.string('commitInterval').notNullable();
    });
};

exports.down = async function(knex) {
  knex.schema.dropTable('config')
};
