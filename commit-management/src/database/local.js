const fs = require('fs')

async function create(repo) {
    console.log('writing on local database')
    try {
        fs.mkdirSync(repo.path)
        let database = JSON.parse(fs.readFileSync('src/database/localDatabase.json'))
        database = [...database, repo]
        fs.writeFileSync('src/database/localDatabase.json', JSON.stringify(database))
        console.log('database updated successfully')


    } catch (e) {
        console.error(e)
        fs.rmdirSync(repo.path)
        console.log('error at database writing')

    }
}

async function getOne(path) {
    let database = JSON.parse(fs.readFileSync('src/database/localDatabase.json'))
    const repo = database.find(repo => repo.path = path)
    return repo
}
async function getAll() {
    let database = JSON.parse(fs.readFileSync('src/database/localDatabase.json'))
    const repos = database.filter(repo => repo.folderName)
    return repos
}

module.exports = {
    create,
    getOne,
    getAll
}