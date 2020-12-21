const chokidar = require('chokidar')
const environment = require('../env.json')
const dataProvider = require('dataProvider')
const observer = chokidar.watch(environment.repositoriesFolder)
observer
    .on('addDir', async (path) => {
        const fileName= path.split('/').pop()
        await dataProvider.create(fileName)
        chokidar.watch(path, {
            ignored: '*.gitignore',
            ignoreInitial: true,
        })
    })
    .on('unlinkDir', path => {
        console.log(`Directory ${path} has been removed`)
    })
    .on('error', error => {
        console.log(`Watcher error: ${error}`)
    })
    .on('ready', () => {
        console.log('Initial scan complete. Ready for changes')
    })
