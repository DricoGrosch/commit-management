const {ipcMain} = require('electron')
const {createRepository, unstageFile} = require('../models/repository.js')

async function buildContext(window, data){
    ipcMain.on('build-context', (event, name) => {
      event.reply('build-context-reply',JSON.stringify(data))
    })
}

ipcMain.on('create-new-repo', (event, name) => {
    createRepository(name)
})
ipcMain.on('get-user-repo', (event, name) => {
    event.reply('get-user-repo-reply')
})

ipcMain.on('unstage-file', async (event, data) => {
    const {path, repoName} = JSON.parse(data)
    await unstageFile(path, repoName)
})

module.exports = {
    buildContext
}