const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
const commits = require('../api/commits')



const {getAll} = require('../database/dataProvider')
const {getFiles} = require('../services/folderManager')
cron.schedule(`*/${commitInterval} * * * *`, async () => {
    const repos = await getAll()
    repos.forEach(async (repo) => {
        const files = await getFiles(repo.path)
        const commitTree = await commits.createTree(repo.name, repo.owner,files)
        const commit = await commits.createCommit(repo.name, repo.owner,commitTree,'main')

    })

});