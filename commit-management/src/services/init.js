const {BrowserWindow} = require('electron')
const {CLIENT_ID} = require('../../app_config')
const {buildContext} = require("../services/eventDispatcher");
const Config = require('../database/entities/Config')
const Repository = require("../database/entities/Repository");
const {createOctokit} = require("./octokit");

async function init(access_token) {
    const windows = BrowserWindow.getAllWindows()
    window = windows.find(win => win.isVisible()) || new BrowserWindow({
        width: 500,
        height: 500,
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
        window.loadFile('src/components/windows/index.html')
        const repos = await Repository.loadAll()
        buildContext(window, {
            repositories: repos,
            config: config
        })
        global.octokit = await createOctokit(access_token)
    } else {
        window.loadURL(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`)
    }
    window.setMenu(null)


}

module.exports = {
    init
}