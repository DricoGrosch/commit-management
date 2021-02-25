exports.up = async function (knex) {
    await knex.schema.createTable('stagedFile', table => {
        table.increments('id').primary();
        table.string('name').notNullable()
        table.string('fullPath').notNullable()
        table.string('relativePath').notNullable()
        table.text('content').nullable()
        table.integer('status').defaultTo(1)
        table.bigInteger('repositoryId').references('id').inTable('repository').notNullable()
    })

};

exports.down = async function (knex) {
    await knex.schema.dropTable('stagedFile')
};
