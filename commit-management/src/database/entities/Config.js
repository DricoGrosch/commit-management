const {Model} = require("objection");

class Config extends Model {
    static get tableName() {
        return 'config';
    }

    static get jsonSchema() {
        return {
            accessToken: {type: 'string'},
            repositoriesFolder: {type: 'string'},
            useRemoteDataProvider: {type: 'boolean'},
            commitInterval: {type: 'string'},
        }
    }
}

module.exports = Config