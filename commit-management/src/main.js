const {app, BrowserWindow, ipcMain} = require('electron')
require('./api/eventDispatcher')
app.on('ready', () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/electronPages/index/index.html')
})

