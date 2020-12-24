const {ipcMain} = require('electron')
const {createRepository} = require('../models/repository.js')
ipcMain.on('create-new-repo', (event, name) => {
    createRepository(name)
})
