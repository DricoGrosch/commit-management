const cron = require('node-cron');
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, app, Notification, Tray} = require('electron')
const Config = require('../database/entities/Config')
// const Repository = require('../database/entities/Repository')
const path = require("path");
const fs = require('fs')
const {showNotification} = require("./notifications");
const git = require('nodegit')
const {autoCommit} = require("../models/Repository");
const {getName, transformFiles, commit} = require("../models/Repository");
Config.getUserConfig().then((data) => {

    if (!data.commitInterval || !data.repositoriesFolder) {
        return
    }
    cron.schedule(`*/${data.commitInterval} * * * *`, async () => {
            const repoPaths = fs.readdirSync(data.repositoriesFolder).filter(name => name !== '.git')
            for (const file of repoPaths) {
                const repoFolder = path.join(data.repositoriesFolder, file)
                const repo = await git.Repository.open(repoFolder);
                const repoName = await getName(repo)
                const index = await repo.refreshIndex()
                let files = await repo.getStatus()
                const transformedFiles = await transformFiles(files)
                if (files.length === 0) {
                    continue
                }
                const notification = await showNotification({
                    title: 'Commit alert',
                    body: `Files from repo ${repoName} will be commited in 10 seconds. Click here to manage the staged files`,
                    timeoutType: 10,
                    icon: path.join(__dirname, '../../', 'static', 'images', 'git_icon.png')
                }, async () => {
                    clearTimeout(commitTimer)
                    const commitWindow = new BrowserWindow({
                        width: 700,
                        height: 400,
                        title: repoName,
                        show: false,
                        webPreferences: {
                            nodeIntegration: true
                        }
                    })
                    commitWindow.setMenu(null)
                    commitWindow.webContents.openDevTools()

                    commitWindow.loadFile('src/components/windows/commitConfirmation.html')
                    buildContext(commitWindow, {stagedFiles: transformedFiles})
                    commitWindow.once("ready-to-show", () => {
                        commitWindow.show();
                    });
                })
                let commitTimer = null
                notification.show()
                commitTimer = setTimeout(async () => {
                    await autoCommit(repo)
                }, 10000)
            }
        }
    );
}, (e) => {
    console.log(e)
});
