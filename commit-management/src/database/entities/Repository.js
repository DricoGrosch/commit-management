const fs = require("fs");
const {transformPath} = require("../../services/folderManager");
const {getFileModel} = require("../../services/folderManager");
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
            owner: {
                relation: Model.HasOneRelation,
                modelClass: Owner,
                join: {
                    from: 'repository.ownerId',
                    to: 'owner.id'
                }
            }
        }
    }

    static async create(name) {
        const path = `${await transformPath(repositoriesFolder)}/${name}`
        let repo = {}
        //uncomment the line below to create github repository
        // repo = await repositories.createRepo(name)
        repo.path = path;
        repo.folderName = name;
        repo.stagedFiles = [];
        repo.allowAutoCommit = true
        try {
            repo = await this.query().insert({
                path: repo.path,
                folderName: repo.folderName,
                stagedFiles: repo.stagedFiles,
                allowAutoCommit: repo.allowAutoCommit,
                default_branch: repo.default_branch,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                pushed_at: repo.pushed_at,
                deployments_url: repo.deployments_url,
                pulls_url: repo.pulls_url,
                contents_url: repo.contents_url,
                compare_url: repo.compare_url,
                merges_url: repo.merges_url,
                url: repo.url,
                id: repo.id,
                node_id: repo.node_id,
                name: repo.name,
                full_name: repo.full_name,
            })
            await initializeRepository(repo.path)
            await repo.atachWatcher(true)
        } catch (e) {
            console.log(e)
            fs.rmdirSync(repo.path)
        }
        return repo
    }

    async getGitIgnoreFiles() {
        const content = fs.readFileSync(`${this.path}/.gitignore`, {encoding: 'utf-8'})
        return content.split('\r\n')
    }

    async atachWatcher(created = false) {
        const watcher = chokidar.watch(this.path, {ignoreInitial: !created})
        watcher.on('add', async (path) => {
            await this.handleChange(path)
        })
        watcher.on('unlink', async (path) => {
            await this.handleChange(path)
        })
        watcher.on('change', async (path, stats) => {
            await this.handleChange(path)
        })
    }

    static async loadAll() {
        const repos = await this.query();
        for (const repo of repos) {
            await repo.atachWatcher();
        }
        return repos
    }

    async handleChange(path) {
        const filesToIgnore = await this.getGitIgnoreFiles()
        const file = await getFileModel(await transformPath(path), this.folderName)
        if (!filesToIgnore.includes(file.name) && !filesToIgnore.includes(file.relativePath)) {
            //todo
            // this.stagedFiles.push(file)
            // dataProvider.update(repo)
        }
    }

    async commit(files) {
        try {
            //uncomment the line below to create github commit
            // const commitTree = await commits.createTree(repo.name, repo.owner.login, files)
            // const commit = await commits.createCommit(repo.name, repo.owner.login, commitTree, 'main')
            const commitedPaths = files.map(({path}) => path)
            this.stagedFiles = this.stagedFiles(file => !commitedPaths.includes(file))
            //todo
            dataProvider.update(repo)
        } catch (e) {
            console.log(e)
        }

    }

}

module.exports = Repository