const fs = require('fs')

async function transformPath(path) {
    return path.replace(/\\/g, '/')
}

async function initializeRepository(path) {
    fs.mkdirSync(path)
    fs.mkdirSync(`${path}/src`)
    fs.appendFileSync(`${path}/.gitignore`, 'node_modules/')
    fs.appendFileSync(`${path}/README.md`)
}

async function getRelativePath(path, repoName) {
    path = path.split('/')
    path = path.slice(path.indexOf(repoName) + 1,)
    path = path.join('/')
    return path
}

module.exports = {
    transformPath,
    getRelativePath,
    initializeRepository,
}