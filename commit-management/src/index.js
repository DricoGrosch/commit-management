const chikidar = require('chokidar')
const environment = require('../env.json')

const observer = chikidar.watch(environment.repositoriesFolder, {
    ignored: '*.gitignore',
    ignoreInitial: true,

})
observer
    .on('addDir', path => {
        console.log(`Directory ${path} has been added`)
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
    .on('raw', (event, path, details) => { // internal
        console.log('Raw event info:', event, path, details);
    });
