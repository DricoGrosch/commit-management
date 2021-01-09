const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './dev.sqlite3'
    }
});

Model.knex(knex);