exports.up = async function (knex) {
    await knex.schema.createTable('repository', table => {
        table.bigInteger('id').primary();
        table.string('path').notNullable()
        table.string('folderName').notNullable()
        table.boolean('allowAutoCommit').defaultTo(true)
        table.string('default_branch').notNullable()
        table.string('created_at').notNullable()
        table.string('updated_at').notNullable()
        table.string('pushed_at').notNullable()
        table.string('deployments_url').notNullable()
        table.string('pulls_url').notNullable()
        table.string('contents_url').notNullable()
        table.string('compare_url').notNullable()
        table.string('merges_url').notNullable()
        table.string('url').notNullable()
        table.string('node_id').notNullable()
        table.string('name').notNullable()
        table.string('full_name').notNullable()
        table.bigInteger('ownerId').references('id').inTable('owner')

    })

};

exports.down = async function (knex) {
    await knex.schema.dropTable('repository')
};
