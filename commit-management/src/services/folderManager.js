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

async function getFileModel(fullPath, repoName) {
    const name = fullPath.split('/').pop()
    let relativePath = await getRelativePath(fullPath, repoName)
    const content = await fs.readFileSync(fullPath, {encoding: 'utf-8'})
    return {
        name,
        fullPath,
        relativePath,
        content
    }
}

async function getRelativePath(path, repoName) {
    path = path.split('/')
    path = path.slice(path.indexOf(repoName) + 1,)
    path = path.join('/')
    return path
}

module.exports = {
    transformPath,
    initializeRepository,
    getFileModel,
    getRelativePath
}