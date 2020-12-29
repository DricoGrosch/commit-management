const {app, BrowserWindow, ipcMain, nativeTheme} = require('electron')
require('./services/eventDispatcher')
require('./services/cronjob')

app.on('ready',async  () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/index.html')
    window.setMenu(null)
    nativeTheme.themeSource = 'dark'
    window.webContents.openDevTools()
})


