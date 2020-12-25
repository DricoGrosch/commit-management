const {ipcMain} = require('electron')
const {createRepository} = require('../models/repository.js')
ipcMain.on('create-new-repo', (event, name) => {
    createRepository(name)
})
ipcMain.on('get-user-repo', (event, name) => {
    event.reply('get-user-repo-reply',)
})

