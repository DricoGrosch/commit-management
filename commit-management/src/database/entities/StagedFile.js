const {Model} = require("objection");

class StagedFile extends Model {
    static get tableName() {
        return 'stagedFile'
    }

    constructor() {
        super();
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'long'},
                name: {type: 'string'},
                fullPath: {type: 'string'},
                relativePath: {type: 'string'},
                content: {type: 'text'},
            }
        }
    }

    static get relationMappings() {
        const Repository = require('./qlm4da')
        return {
            repository: {
                relation: Model.HasOneRelation,
                modelClass: Repository,
                join: {
                    from: 'repository.id',
                    to: 'stagedFile.repositoryId'
                }
            }
        }
    }

}

module.exports = StagedFile
