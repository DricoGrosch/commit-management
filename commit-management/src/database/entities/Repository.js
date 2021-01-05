const {Model} = require("objection");

class Repository extends Model {
    static get tableName() {
        return 'repository'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                path: {type: 'string'},
                folderName: {type: 'string'},
                stagedFiles: {type: 'string'},
                allowAutoCommit: {type: 'string'},
                default_branch: {type: 'string'},
                created_at: {type: 'string'},
                updated_at: {type: 'string'},
                pushed_at: {type: 'string'},
                deployments_url: {type: 'string'},
                pulls_url: {type: 'string'},
                contents_url: {type: 'string'},
                compare_url: {type: 'string'},
                merges_url: {type: 'string'},
                url: {type: 'string'},
                id: {type: 'string'},
                node_id: {type: 'string'},
                name: {type: 'string'},
                full_name: {type: 'string'},
            }
        }
    }
    static get relationMappings() {
        const Owner = require('./Owner')
        return {
            owner:{
                relation:Model.HasOneRelation,
                modelClass:Owner,
                join: {
                    from: 'repository.ownerId',
                    to: 'owner.id'
                }
            }
        }
    }
}

module.exports = Repository