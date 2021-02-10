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
            getUserConfig: {type: 'method'},
        }
    }
    static async getUserConfig(){
        return await this.query().first()
    }
}

module.exports = Config