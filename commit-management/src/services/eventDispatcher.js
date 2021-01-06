const {ipcMain, BrowserWindow} = require('electron')
const {createRepository, commit} = require('../models/repository.js')

async function buildContext(window, data) {
    data.windowId = window.id
    ipcMain.on('build-context', () => {
        window.webContents.send('build-context-reply', JSON.stringify(data))
    })
}

ipcMain.on(`unload-window`, (event, windowId) => {
    BrowserWindow.fromId(windowId).close()
})

ipcMain.on('create-new-repo', (event, name) => {
    createRepository(name)
})
ipcMain.on('get-user-repo', (event, name) => {
    event.reply('get-user-repo-reply')
})

ipcMain.on('commit', async (event, data) => {
    const {repoId, stagedFiles, windowId} = JSON.parse(data)
    await commit(repoId, stagedFiles)
    BrowserWindow.fromId(windowId).close()
})
ipcMain.on('auth-user',async(event,data)=>{
    const {username,password} = JSON.parse(data)
    authenticate(username,password)
})
module.exports = {
    buildContext,
}