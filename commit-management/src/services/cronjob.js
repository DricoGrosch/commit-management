const cron = require('node-cron');
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, app, Notification, Tray} = require('electron')
const Config = require('../database/entities/Config')
const Repository = require('../database/entities/Repository')
const path = require("path");
Config.getUserConfig().then(({commitInterval}) => {
    cron.schedule(`*/${commitInterval} * * * *`, async () => {
        const repos = await Repository.query()
        for (const repo of repos) {
            if (!repo.allowAutoCommit) {
                continue;
            }
            const repoStagedFiles = await repo.getStagedFiles()
            if (repoStagedFiles.length === 0) {
                continue
            }

            const notification = new Notification({
                title: 'Commit alert',
                body: `${repoStagedFiles.length} files from repo ${repo.name.toUpperCase()} will be commited in 10 seconds. Click here to manage the staged files`,
                timeoutType: 10,
                icon: path.join(__dirname, '../../', 'static', 'images', 'git_icon.png')
            })
            let commitTimer = null
            notification.on('click', () => {
                clearTimeout(commitTimer)
                const commitWindow = new BrowserWindow({
                    width: 700,
                    height: 400,
                    title: repo.name,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                commitWindow.loadFile('src/components/windows/commitConfirmation.html')
                commitWindow.setMenu(null)
                buildContext(commitWindow, {repoId: repo.id, stagedFiles: repoStagedFiles})
            })
            notification.show()
            commitTimer = setTimeout(async () => {
                await repo.commit(repoStagedFiles)
            }, 10000)
        }

    });
}, (e) => {
    console.log(e)
});
