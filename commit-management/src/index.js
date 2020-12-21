const watch = require('node-watch');
const {repositoriesFolder} = require('../env.json')
const {createRepository} = require('./repository')

function transformRootPath() {
    let rootPath = repositoriesFolder.split('\\')
    rootPath.pop()
    return rootPath.join('\\')
}

watch(transformRootPath(repositoriesFolder), {recursive: false}, function (evt) {
    evt === "update" ? createRepository(repositoriesFolder) : null
});