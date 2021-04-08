
exports.up = async function(knex) {
    await knex.schema.createTable('config', table => {
        table.increments('id').primary();
        table.string('accessToken').notNullable().defaultTo('');
        table.string('repositoriesFolder').nullable()
        table.string('useRemoteDataProvider').notNullable().defaultTo(true);
        table.string('commitInterval').notNullable().defaultTo(30);
    });
};

exports.down = async function(knex) {
  knex.schema.dropTable('config')
};
