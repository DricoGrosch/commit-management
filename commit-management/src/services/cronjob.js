const cron = require('node-cron');
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, app, Notification, Tray} = require('electron')
const Config = require('../database/entities/Config')
// const Repository = require('../database/entities/Repository')
const path = require("path");
const fs = require('fs')
const {showNotification} = require("./notifications");
const git = require('nodegit')
const {commit} = require("../models/Repository");
const {clone} = require("../models/Repository");
Config.getUserConfig().then((data) => {

    if (!data.commitInterval || !data.repositoriesFolder) {
        return
    }
    cron.schedule(`*/${data.commitInterval} * * * *`, async () => {
            // await clone("https://github.com/DricoGrosch/pin2.git",'pin2')
            const repoPaths = fs.readdirSync(data.repositoriesFolder).filter(name => name !== '.git')
            for (const file of repoPaths) {
                const repoFolder = path.join(data.repositoriesFolder, file)
                const repo = await git.Repository.open(repoFolder);
                repo.setWorkdir(repoFolder, 0);
                const files = await repo.getStatus();
                // await commit(repo, files)

                // , {
                // callbacks: {
                //     credentials: function(url, userName) {
                //         console.log("Requesting creds");
                //         return NodeGit.Cred.sshKeyFromAgent(userName);
                //     }
                // }

                //         // changes and head are each oids. Read about them here:
                //         // https://hackage.haskell.org/package/gitlib-0.6.5/docs/Data-Git-Oid.html
                //
                //
                //         // const repoStagedFiles = await repo.getStagedFiles()
                //         // if (repoStagedFiles.length === 0) {
                //         //     continue
                //         // }
                //         // const notification = await showNotification({
                //         //     title: 'Commit alert',
                //         //     body: `${repoStagedFiles.length} files from repo ${repo.name.toUpperCase()} will be commited in 10 seconds. Click here to manage the staged files`,
                //         //     timeoutType: 10,
                //         //     icon: path.join(__dirname, '../../', 'static', 'images', 'git_icon.png')
                //         // }, () => {
                //         //     clearTimeout(commitTimer)
                //         //     const commitWindow = new BrowserWindow({
                //         //         width: 700,
                //         //         height: 400,
                //         //         title: repo.name,
                //         //         show: false,
                //         //         webPreferences: {
                //         //             nodeIntegration: true
                //         //         }
                //         //     })
                //         //     commitWindow.setMenu(null)
                //         //     commitWindow.webContents.openDevTools()
                //         //
                //         //     commitWindow.loadFile('src/components/windows/commitConfirmation.html')
                //         //     buildContext(commitWindow, {repoId: repo.id, stagedFiles: repoStagedFiles})
                //         //     commitWindow.once("ready-to-show", () => {
                //         //         commitWindow.show();
                //         //     });
                //         // })
                //         // let commitTimer = null
                //         // notification.show()
                //         // commitTimer = setTimeout(async () => {
                //         //     await repo.commit(repoStagedFiles)
                //         // }, 10000)
            }
            //
        }
    );
}, (e) => {
    console.log(e)
});
