const fs = require('fs')

async function transformPath(path) {
    return path.replace(/\\/g, '/')
}
async function initializeRepository(path){
    fs.mkdirSync(path)
    fs.mkdirSync(`${path}/src`)
    fs.appendFileSync(`${path}/.gitignore`,'node_modules/')
    fs.appendFileSync(`${path}/README.md`)
}

module.exports = {
    transformPath,
    initializeRepository
}