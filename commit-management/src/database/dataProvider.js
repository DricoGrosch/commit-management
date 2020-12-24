const {useRemoteDataProvider} = require('../../env.json')
const dataProvider = useRemoteDataProvider ? require('./remote') : require('./local')

async function create(repo) {
    await dataProvider.create(repo)
}

async function getOne(path) {
    const repo = await dataProvider.getOne(path)
    return repo
}

module.exports = {
    create,
    getOne
}

