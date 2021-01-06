const {BrowserWindow} = require('electron')
const {CLIENT_ID} = require('../../app_config')
const {loadRepos} = require("../models/repository");
const {buildContext} = require("../services/eventDispatcher");

async function init(access_token) {
    const windows = BrowserWindow.getAllWindows()
    window = windows.find(win => win.isVisible()) || new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const repos = await loadRepos()
    access_token ? window.loadFile('src/components/windows/index.html') : window.loadURL(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
    window.webContents.openDevTools()
    window.setMenu(null)
    buildContext(window, {
        repositories: repos
    })
}

module.exports = {
    init
}