const cron = require('node-cron');
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, app} = require('electron')
const Config = require('../database/entities/Config')
const Repository = require('../database/entities/Repository')
Config.getUserConfig().then(({commitInterval}) => {
    cron.schedule(`*/${commitInterval} * * * *`, async () => {
        const repos = await Repository.query()
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
            window.webContents.openDevTools()
            buildContext(window, {repoId: repo.id, stagedFiles: await repo.getStagedFiles()})

            // window.on('focus', (event) => {
            //     console.log('focus')
            //     event.sender.webContents.send('window-focus')
            // })
            // window.on('blur', (event) => {
            //     console.log('blur')
            //     event.sender.webContents.send('window-blur')
            // })
        });

    });
}, (e) => {
    console.log(e)
});
