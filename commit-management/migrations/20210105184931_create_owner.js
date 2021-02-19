exports.up = async function (knex) {
    await knex.schema.createTable('owner', table => {
        table.bigInteger('id').primary();
        table.string('login').notNullable();
        table.string('node_id').notNullable();
        table.string('avatar_url').notNullable();
        table.string('gravatar_id').notNullable();
        table.string('url').notNullable();
        table.string('html_url').notNullable();
        table.string('followers_url').notNullable();
        table.string('following_url').notNullable();
        table.string('gists_url').notNullable();
        table.string('starred_url').notNullable();
        table.string('subscriptions_url').notNullable();
        table.string('organizations_url').notNullable();
        table.string('repos_url').notNullable();
        table.string('events_url').notNullable();
        table.string('received_events').nullable();
        table.string('type').notNullable();
        table.boolean('site_admin').notNullable();

    })
};

exports.down = async function (knex) {
    await knex.schema.dropTable('owner')
};
