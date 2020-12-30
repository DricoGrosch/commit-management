const {app, BrowserWindow, ipcMain, nativeTheme} = require('electron')
require('./services/eventDispatcher')
require('./services/cronjob')
const {buildContext} = require("./services/eventDispatcher");
nativeTheme.themeSource = 'dark'
app.on('ready',async  () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/components/windows/index.html')
    window.setMenu(null)
    buildContext(window,{})
    // window.webContents.openDevTools()
})


