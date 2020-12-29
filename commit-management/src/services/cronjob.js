const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
const commits = require('../api/commits')
const {getGitIgnoreFiles,getFiles} = require('../models/repository')
const {getAll} = require('../database/dataProvider')
cron.schedule(`*/${commitInterval} * * * *`, async () => {
    const repos = await getAll()
    repos.forEach(async (repo) => {
        let files = await getFiles(repo.path,repo.folderName)
        console.log(`${files.length} files`)
        const filesToIgnore = await getGitIgnoreFiles(repo.path)
        files = files.filter(file => !filesToIgnore.includes(file.name) && !filesToIgnore.includes(file.path))
        console.log(`${files.length} files after gitignore check`)
        const commitTree = await commits.createTree(repo.name, repo.owner.login, files)
        const commit = await commits.createCommit(repo.name, repo.owner.login, commitTree, 'main')
    })

});