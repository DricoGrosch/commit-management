const fs = require('fs')

async function transformPath(path) {
    return path.replace(/\\/g, '/')
}

async function getFiles(folderPath) {
    let files = []
    await fs.readdirSync(folderPath, {withFileTypes: true}).map(async (result) => {
        if (result.isDirectory()) {
            //SAMERDA N TA ESPERANDO A RECURSÃO
            const dirFiles = await getFiles(`${await transformPath(folderPath)}/${result.name}`)
            files = [...files, ...dirFiles]
        } else {
            const path =`${await transformPath(folderPath)}/${result.name}`
            const content=await fs.readFileSync(path,{encoding:'utf-8'})
            files.push({
                path,
                content
        })
        }
    })
    return files
}

module.exports = {
    transformPath,
    getFiles
}