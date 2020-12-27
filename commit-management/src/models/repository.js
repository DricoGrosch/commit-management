const dataProvider = require('../database/dataProvider')
const api = require('../api/api')
const {transformPath, getFiles} = require('../services/folderManager')
// const chokidar = require('chokidar');
const {repositoriesFolder} = require('../../env.json')

async function createRepository(name) {
    const path = `${await transformPath(repositoriesFolder)}/${name}`
    let repo = {}
    //uncomment the line below to create github repository
    // repo = await api.createRepo(name)
    repo.path = path;
    repo.folderName = name;
    repo.unstagedFiles = [];
    await dataProvider.create(repo)

    return repo
}

async function addFile(newPath, unstagedFiles, created = true, updated = false, deleted = false) {
    if (!unstagedFiles.includes(newPath)) {
        unstagedFiles.push({path: newPath, created, updated, deleted})
    }
    return unstagedFiles
}

async function commit(unstagedFiles) {
}

async function getAll() {
const repos = dataProvider.getAll()
}

module.exports = {
    createRepository
}