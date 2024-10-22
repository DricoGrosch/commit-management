const fs = require("fs");

const {transformPath, initializeRepository} = require("../../services/folderManager");
const {Model} = require("objection");
const Config = require('./Config')
const repositories = require("../../api/repositories");
const chokidar = require("chokidar");
const commits = require("../../api/commits");
const Owner = require("./Owner");
const StagedFile = require("./StagedFile");
const {getRelativePath} = require("../../services/folderManager");
const {transaction} = require('objection');

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
                allowAutoCommit: {type: 'boolean'},
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
                id: {type: 'long'},
                node_id: {type: 'string'},
                name: {type: 'string'},
                full_name: {type: 'string'},
                relationMappings: {type: 'method'},
                create: {type: 'method'},
                getGitIgnorePaths: {type: 'method'},
                atachWatcher: {type: 'method'},
                loadAll: {type: 'method'},
                handleLink: {type: 'method'},
                commit: {type: 'method'},
                getStagedFiles: {type: 'method'},
                unstage: {type: 'method'},
            }
        }
    }


    async getStagedFiles() {
        let gitIgnoreContent = ''
        try {
            gitIgnoreContent = fs.readFileSync(`${this.path}/.gitignore`, {encoding: 'utf-8'})
        } catch (e) {
            console.log(e)
        }
        let stagedFiles = await StagedFile.query().select(
            'id',
            'name',
            'fullPath',
            'relativePath',
            'status',
        )
        const filesToDelete = []

        for (const file of stagedFiles) {
            if (await file.isOnGitIgnore(gitIgnoreContent.split('\r\n'))) {
                filesToDelete.push(file)
            }
        }

        stagedFiles = stagedFiles.filter(stagedFile => {
            return !filesToDelete.find(({id}) => id === stagedFile.id)
        })
        await this.unstageFiles(filesToDelete)
        return stagedFiles
    }

    async unstageFiles(files) {
        const idsToRemove = files.map(({id}) => id)
        try {
            await StagedFile.query().delete().whereIn('id', idsToRemove)
        } catch (e) {
            console.log(e)
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
        const config = await Config.getUserConfig()
        const path = `${await transformPath(config.repositoriesFolder)}/${name}`
        let repo = {}
        //uncomment the line below to create github repository
        repo = await repositories.createRepo(name)
        repo.path = path;
        repo.folderName = name;
        repo.allowAutoCommit = true
        try {
            let owner = await Owner.query().findById(repo.owner.id)
            if (!owner) {
                owner = await Owner.query().insert({
                    id: repo.owner.id,
                    login: repo.owner.login,
                    node_id: repo.owner.node_id,
                    avatar_url: repo.owner.avatar_url,
                    gravatar_id: repo.owner.gravatar_id,
                    url: repo.owner.url,
                    html_url: repo.owner.html_url,
                    followers_url: repo.owner.followers_url,
                    following_url: repo.owner.following_url,
                    gists_url: repo.owner.gists_url,
                    starred_url: repo.owner.starred_url,
                    subscriptions_url: repo.owner.subscriptions_url,
                    organizations_url: repo.owner.organizations_url,
                    repos_url: repo.owner.repos_url,
                    events_url: repo.owner.events_url,
                    received_events: repo.owner.received_events,
                    type: repo.owner.type,
                    site_admin: repo.owner.site_admin,
                })
            }

            repo = await this.query().insert({
                path: repo.path,
                folderName: repo.folderName,
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
                ownerId: owner.id,
            })
            await initializeRepository(repo.path)
            await repo.atachWatcher(true)
        } catch (e) {
            console.log(e)
            fs.rmdirSync(repo.path)
        }
        return repo
    }

    async getGitIgnorePaths() {
        const content = fs.readFileSync(`${this.path}/.gitignore`, {encoding: 'utf-8'})
        return content.split('\r\n')
    }

    async atachWatcher(created = false) {
        const watcher = chokidar.watch(this.path, {ignoreInitial: !created})
        watcher.on('add', async (path) => {
            await this.handleLink(await transformPath(path))
        })
        watcher.on('unlink', async (path) => {
            await this.handleUnlink(await transformPath(path))
        })
        watcher.on('change', async (path) => {
            await this.handleChange(await transformPath(path))
        })
    }

    static async loadAll() {
        const repos = await this.query().withGraphFetched('owner');
        for (const repo of repos) {
            await repo.atachWatcher();
        }
        return repos
    }

    async handleLink(fullPath) {
        try {
            await StagedFile.create(fullPath, StagedFile.CREATED, this)
        } catch (err) {
            throw err;
        }
    }

    async handleUnlink(fullPath) {
        try {
            const file = await StagedFile.query().where('fullPath', fullPath).first()
            if (!file) {
                await StagedFile.create(fullPath, StagedFile.REMOVED, this)
            } else {
                if (file.status === StagedFile.CREATED) {
                    await StagedFile.query().deleteById(file.id)
                } else {
                    await file.$query().patch({status: StagedFile.REMOVED})
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async handleChange(fullPath) {
        try {
            const file = await StagedFile.query().where('fullPath', fullPath).first()
            if (!file) {
                await StagedFile.create(fullPath, StagedFile.UPDATED, this)
            } else {
                // const content = fs.readFileSync(fullPath, 'utf8')
                await file.$query().patch({status: StagedFile.UPDATED})
            }
        } catch (e) {
            console.log(e)
        }
    }

    async commit(files) {
        try {
            const commitTree = await commits.createTree(this.name, this.owner.login, files, 'main')
            await commits.createCommit(this.name, this.owner.login, commitTree, 'main')
            await this.unstageFiles(files)
        } catch (e) {
            console.log(e)
        }

    }

}

module.exports = Repository