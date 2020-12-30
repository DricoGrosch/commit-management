const dataProvider = require('../database/dataProvider')
const fs = require('fs')
const repositories = require('../api/repositories')
const {transformPath, initializeRepository} = require('../services/folderManager')
const {repositoriesFolder} = require('../../env.json')

async function createRepository(name) {
    const path = `${await transformPath(repositoriesFolder)}/${name}`
    let repo = {}
    //uncomment the line below to create github repository
    // repo = await repositories.createRepo(name)
    repo.path = path;
    repo.folderName = name;
    repo.stagedFiles = {
        added: [],
        updated: [],
        removed: [],
    };
    repo.allowAutoCommit = true
    try {
        await dataProvider.create(repo)
        await initializeRepository(repo.path)
    } catch (e) {
        fs.rmdirSync(repo.path)
    }
    return repo
}

async function getGitIgnoreFiles(repoPath) {
    const content = fs.readFileSync(`${repoPath}/.gitignore`, {encoding: 'utf-8'})
    return content.split('\r\n')
}

async function getRelativePath(path, repoName) {
    path = path.split('/')
    path = path.slice(path.indexOf(repoName) + 1,)
    path = path.join('/')
    return path
}

async function getFiles(folderPath, repoName) {
    folderPath = `${await transformPath(folderPath)}`
    const folderRelativePath = await getRelativePath(folderPath, repoName)
    let files = []
    await fs.readdirSync(folderPath, {withFileTypes: true}).map(async (result) => {
        if (result.isDirectory()) {
            const folderFiles = await getFiles(`${await transformPath(folderPath)}/${result.name}`, repoName)
            files = [...files, ...folderFiles]
        } else {
            const fullPath = `${folderPath}/${result.name}`
            const relativePath = folderRelativePath.trim() !== '' ? `${folderRelativePath}/${result.name}` : result.name
            const content = await fs.readFileSync(fullPath, {encoding: 'utf-8'})
            files.push({
                name: result.name,
                fullPath,
                relativePath,
                content
            })
        }
    })
    return files
}

async function unstageFile(path, repoId) {
    const repo = dataProvider.getOne(repoId)
    repo.stagedFiles = repo.stagedFiles.filter(p => p !== path)
    dataProvider.update(repo)
}

module.exports = {
    createRepository,
    getGitIgnoreFiles,
    getRelativePath,
    getFiles,
    unstageFile

}