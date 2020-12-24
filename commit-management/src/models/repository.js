const dataProvider = require('./dataProvider')
const chokidar = require('chokidar')

async function createRepository(path) {

    const repo = chokidar.watch(path)
    let responseData = {}
    //uncomment the line below to create github repository
    // responseData = await dataProvider.create(path.replace(/\\/g, '/').split('/').pop())
    repo.path = path;
    repo.unstagedFiles = [];
    repo.id = responseData.id
    repo.nodeId = responseData.node_id
    repo.name = responseData.name
    repo.owner = responseData.owner
    repo.url = responseData.url
    repo.cloneUrl = responseData.clone_url
    repo.createdAt = responseData.created_at
    repo.updatedAt = responseData.updated_at
    repo.pushedAt = responseData.pushed_at
    repo.commitsUrls = responseData.commits_url
    repo.gitCommitsUrls = responseData.git_commits_url

    repo.on('addDir', async (path) => {
        repo.unstagedFiles.push(path)
    })
    repo.on('add', async (path) => {
        repo.unstagedFiles.push(path)
    })
    repo.on('change', async (path,stats) => {
        repo.unstagedFiles.push(path)

    })
    repo.on('unlink', async (path) => {
        repo.unstagedFiles = repo.unstagedFiles.filter(p => p !== path)
    })
    return repo
}

async function addFile(path) {
}

async function commit() {
}

module.exports = {
    createRepository
}