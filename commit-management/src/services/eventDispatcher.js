const {app, ipcMain, BrowserWindow, dialog} = require('electron')
const Config = require('../database/entities/Config')
const Repository = require("../database/entities/Repository");
const {create} = require("../models/Repository");

async function buildContext(window, data) {
    data.windowId = window.id
    window.once("show", function () {
        window.webContents.send('build-context-reply', JSON.stringify(data))
    });
}

ipcMain.on(`unload-window`, (event, windowId) => {
    BrowserWindow.fromId(windowId).close()
})

ipcMain.on('create-new-repo', async (event, name) => {
    const repo = await create(name)
    event.reply('create-new-repo-reply', JSON.stringify({repo}))
})
ipcMain.on('get-user-repo', (event, name) => {
    event.reply('get-user-repo-reply')
})

ipcMain.on('commit', async (event, data) => {
    const {repoId, stagedFiles, windowId} = JSON.parse(data)
    const repo = await Repository.query().findById(repoId).eager('owner')
    await repo.commit(stagedFiles)
    BrowserWindow.fromId(windowId).close()
})
ipcMain.on('save-config', async (event, data) => {
    const config = JSON.parse(data)
    await Config.query().patchAndFetchById(config.id, config)
    app.relaunch()
    app.exit()
})
ipcMain.on('select-dir', async (event, arg) => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    event.reply('selected-dir', result.filePaths[0])
})
ipcMain.on('change-auto-commit', async (event, data) => {
    const {id} = JSON.parse(data)
    const repo = await Repository.query().findById(id)
    let success = false
    try {
        await repo.$query().patch({allowAutoCommit: !repo.allowAutoCommit})
        success = true
    } catch (err) {
        console.log(err)
    }
    event.reply('reply-change-auto-commit', {success,id})
})
module.exports = {
    buildContext,
}