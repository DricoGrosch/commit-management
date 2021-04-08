const fs = require('fs')

async function readDatabase() {
    return JSON.parse(fs.readFileSync('src/database/localDatabase.json'))
}

async function writeDatabase(data) {
    fs.writeFileSync('src/database/localDatabase.json', JSON.stringify(data))
}

async function create(repo) {
    console.log('writing on local database')
    try {
        let database = await readDatabase()
        await writeDatabase([...database, repo])
        console.log('database updated successfully')
    } catch (e) {
        console.error(e)
        console.log('error at database writing')
    }
}

async function getOne(id) {
    let database = await readDatabase()
    const repo = database.find(repo => repo.id === id)
    return repo
}

async function update(repo) {
    let database = await readDatabase()
    database = database.filter(r => r.id !== repo.id)
    await writeDatabase([...database, repo])
    console.log('repository updated successfully')

}

async function getAll() {
    let database = JSON.parse(fs.readFileSync('src/database/localDatabase.json'))
    const repos = database.filter(repo => repo.folderName)
    return repos
}

module.exports = {
    create,
    getOne,
    getAll,
    update
}