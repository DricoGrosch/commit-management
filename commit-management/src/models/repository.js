const dataProvider = require('../database/dataProvider')
const api = require('../api/api')
const {transformPath} = require('../services/pathManager')
const watch = require('node-watch');
const {repositoriesFolder} = require('../../env.json')

async function createRepository(name) {
    const path = `${await transformPath(repositoriesFolder)}/${name}`
    let repo = {}
    //uncomment the line below to create github repository
    // repo = await api.createRepo(name)
    repo.path = path;
    repo.unstagedFiles = [];
    await dataProvider.create(repo)
    watch(path, {recursive: true},
        async (evt, repoPath) => repo.unstagedFiles = await addFile(repoPath, repo.unstagedFiles));
    return repo
}

async function addFile(newPath, unstagedFiles) {
    if (!unstagedFiles.includes(newPath)) {
        unstagedFiles.push(newPath)
    }
    return unstagedFiles
}

async function commit(unstagedFiles) {
}

async function getAll(){

}
module.exports = {
    createRepository
}