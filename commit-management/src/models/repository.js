const {create} = require('../database/dataProvider')
const watch = require('node-watch');
const {repositoriesFolder} = require('../../env.json')

async function createRepository(name) {
    const path = `${repositoriesFolder}\\${name}`
    let repo = {}
    //uncomment the line below to create github repository
    // repo = await api.create(path.replace(/\\/g, '/').split('/').pop())
    repo.path = path;
    repo.unstagedFiles = [];
    await create(repo)
    watch(path, {recursive: true}, async (evt, repoPath) => {
        evt === "update"
            ? repo.unstagedFiles = await addFile(repoPath, repo.unstagedFiles)
            : repo.unstagedFiles = repo.unstagedFiles.filter(p => p !== repoPath)
    });
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

module.exports = {
    createRepository
}