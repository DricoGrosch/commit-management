const {app, BrowserWindow, ipcMain} = require('electron')
require('./services/eventDispatcher')
app.on('ready', () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/uiPages/index/index.html')
    window.webContents.openDevTools()
})

