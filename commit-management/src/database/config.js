const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: 'commit-management.db'
    }
});

// Give the knex instance to objection.
Model.knex(knex);