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
                isOnGitIgnore: {type: 'method'},
            }
        }
    }

    static get relationMappings() {
        const Repository = require('./Repository')
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

    async isOnGitIgnore(gitIgnorePaths) {
        const relativePathWithoutName = `${this.relativePath.split('/').slice(0, this.relativePath.split('/').length - 1).join('/')}/`
        return gitIgnorePaths.includes(this.name) || gitIgnorePaths.includes(this.relativePath) || gitIgnorePaths.includes(relativePathWithoutName)
    }
}

module.exports = StagedFile
