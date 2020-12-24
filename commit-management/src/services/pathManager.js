async function transformPath(path){
    return path.replace(/\\/g, '/')
}

module.exports = {
    transformPath
}