const {app,ipcMain, BrowserWindow} = require('electron')
const {createRepository, commit} = require('../models/repository.js')
const Config = require('../database/entities/Config')
const Repository = require("../database/entities/Repository");

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
    Repository.create(name)
})
ipcMain.on('get-user-repo', (event, name) => {
    event.reply('get-user-repo-reply')
})

ipcMain.on('commit', async (event, data) => {
    const {repoId, stagedFiles, windowId} = JSON.parse(data)
    const repo = await Repository.query().findById(repoId)
    await repo.commit(stagedFiles)
    BrowserWindow.fromId(windowId).close()
})
ipcMain.on('save-config', async (event, data) => {
    const config = JSON.parse(data)
    await Config.query().patchAndFetchById(config.id, config)
    app.relaunch()
    app.exit()
})
module.exports = {
    buildContext,
}