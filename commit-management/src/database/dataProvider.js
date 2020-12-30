const {useRemoteDataProvider} = require('../../env.json')
const dataProvider = useRemoteDataProvider ? require('./remote') : require('./local')

async function create(repo) {
    await dataProvider.create(repo)
}

async function getOne(id) {
    const repo = await dataProvider.getOne(id)
    return repo
}
async function getAll() {
    const repos = await dataProvider.getAll()
    return repos
}
async function update(repo){
    await dataProvider.update(repo)
}
module.exports = {
    create,
    getOne,
    getAll,
    update
}

