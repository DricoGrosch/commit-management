const dataProvider = require('../database/dataProvider')
const fs = require('fs')
const repositories = require('../api/repositories')
const commits = require('../api/commits')
const {transformPath, initializeRepository} = require('../services/folderManager')
const {repositoriesFolder} = require('../../env.json')
const chokidar = require('chokidar')

async function createRepository(name) {
    const path = `${await transformPath(repositoriesFolder)}/${name}`
    let repo = {}
    //uncomment the line below to create github repository
    // repo = await repositories.createRepo(name)
    repo.path = path;
    repo.folderName = name;
    repo.stagedFiles = [];
    repo.allowAutoCommit = true
    try {
        await dataProvider.create(repo)
        await initializeRepository(repo.path)
        await atachRepoWatcher(repo,true)
    } catch (e) {
        console.log(e)
        fs.rmdirSync(repo.path)
    }
    return repo
}

async function getGitIgnoreFiles(repoPath) {
    const content = fs.readFileSync(`${repoPath}/.gitignore`, {encoding: 'utf-8'})
    return content.split('\r\n')
}

async function handleRepoChange(repo, path) {
    const filesToIgnore = await getGitIgnoreFiles(repo.path)
    const file = await getFileModel(await transformPath(path), repo.folderName)
    if (!filesToIgnore.includes(file.name) && !filesToIgnore.includes(file.relativePath)) {
        repo.stagedFiles.push(file)
        dataProvider.update(repo)
    }
}

async function atachRepoWatcher(repo,created=false) {
    const watcher = chokidar.watch(repo.path,{ignoreInitial:!created})
    watcher.on('add', async (path) => {
        await handleRepoChange(repo, path)
    })
    watcher.on('unlink', async (path) => {
        await handleRepoChange(repo, path)
    })
    watcher.on('change', async (path, stats) => {
        await handleRepoChange(repo, path)
    })
}

async function loadRepos() {
    const repos = await dataProvider.getAll()
    repos.forEach(async (repo) => await atachRepoWatcher(repo))
    return repos
}

async function getRelativePath(path, repoName) {
    path = path.split('/')
    path = path.slice(path.indexOf(repoName) + 1,)
    path = path.join('/')
    return path
}

async function getFileModel(fullPath, repoName) {
    const name = fullPath.split('/').pop()
    let relativePath = await getRelativePath(fullPath, repoName)
    const content = await fs.readFileSync(fullPath, {encoding: 'utf-8'})
    return {
        name,
        fullPath,
        relativePath,
        content
    }
}

async function commit(repoId, files) {
    const repo = await dataProvider.getOne(repoId)
    //uncomment the line below to create github commit
    // const commitTree = await commits.createTree(repo.name, repo.owner.login, files)
    // const commit = await commits.createCommit(repo.name, repo.owner.login, commitTree, 'main')
}

module.exports = {
    createRepository,
    commit,
    loadRepos
}

