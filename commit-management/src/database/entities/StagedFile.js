const fs = require("fs");
const {transformPath} = require("../../services/folderManager");
const {getRelativePath} = require("../../services/folderManager");
const {Model} = require("objection");

class StagedFile extends Model {
    static CREATED = 1
    static UPDATED = 2
    static REMOVED = 3

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
                status: {type: 'integer'},
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
        return gitIgnorePaths.includes(this.name) || gitIgnorePaths.includes(this.relativePath) || gitIgnorePaths.includes(relativePathWithoutName);
    }

    static async create(fullPath, status, repository) {
        fullPath = await transformPath(fullPath)
        const name = fullPath.split('/').pop()
        let relativePath = await getRelativePath(fullPath, repository.folderName)
        return this.query().insert({
            name,
            fullPath,
            relativePath,
            status,
            repositoryId: repository.id
        });
    }
}

module.exports = StagedFile
