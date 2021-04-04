const {BrowserWindow} = require('electron')
const {CLIENT_ID} = require('../../app_config')
const {buildContext} = require("../services/eventDispatcher");
const Config = require('../database/entities/Config')
const Repository = require("../database/entities/Repository");
const {createOctokit} = require("./octokit");

async function init(access_token) {

    const windows = BrowserWindow.getAllWindows()
    const window = windows.find(win => win.isVisible()) || new BrowserWindow({
        width: 500,
        height: 500,
        show: false,

        webPreferences: {
            nodeIntegration: true
        }
    })

    if (access_token) {
        let config = await Config.getUserConfig()
        if (!config) {
            config = await Config.query().insert({
                accessToken: access_token
            })
        } else {
            await Config.query().patch({accessToken: access_token})
        }
        window.webContents.openDevTools()
        const repos = await Repository.loadAll()
        buildContext(window, {
            repositories: [],
            config: config
        })
        window.loadFile('src/components/windows/index.html')

        global.octokit = await createOctokit(access_token)
    } else {
        window.loadURL(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`)
    }
     window.once("ready-to-show", () => {
            window.show();
        });
    window.setMenu(null)


}

module.exports = {
    init
}