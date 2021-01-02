const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, nativeTheme} = require('electron')
const {getAll, update} = require('../database/dataProvider')
cron.schedule(`*/${commitInterval} * * * *`, async () => {
    const repos = await getAll()
    repos.map(async (repo) => {
        if (!repo.allowAutoCommit) {
            return
        }
        const window = new BrowserWindow({
            width: 500,
            height: 200,
            title: repo.name,
            webPreferences: {
                nodeIntegration: true
            }
        })
        window.loadFile('src/components/windows/commitConfirmation.html')
        window.setMenu(null)
        // window.webContents.openDevTools()
        buildContext(window, {repoId: repo.id, stagedFiles: repo.stagedFiles})
    });

});