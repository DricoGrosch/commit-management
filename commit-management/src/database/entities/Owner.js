const {Model} = require("objection");

class Owner extends Model {
    static get tableName() {
        return 'owner';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'long'},
                login: {type: 'string'},
                node_id: {type: 'string'},
                avatar_url: {type: 'string'},
                gravatar_id: {type: 'string'},
                url: {type: 'string'},
                html_url: {type: 'string'},
                followers_url: {type: 'string'},
                following_url: {type: 'string'},
                gists_url: {type: 'string'},
                starred_url: {type: 'string'},
                subscriptions_url: {type: 'string'},
                organizations_url: {type: 'string'},
                repos_url: {type: 'string'},
                events_url: {type: 'string'},
                received_events: {type: 'string'},
                type: {type: 'string'},
                site_admin: {type: 'boolean'},
            }


        }
    }
}

module.exports = Owner