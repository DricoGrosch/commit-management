const {app, BrowserWindow, ipcMain, nativeTheme} = require('electron')
require('./services/eventDispatcher')
require('./services/cronjob')
const {loadRepos} = require("./models/repository");
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
    const repos = await loadRepos()
    window.loadFile('src/components/windows/index.html')
    window.setMenu(null)
    buildContext(window,{
        repositories: repos
    })
    // window.webContents.openDevTools()
})


