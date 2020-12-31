const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
const {getFiles, getGitIgnoreFiles} = require('../models/repository')
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, nativeTheme} = require('electron')
const {getAll, update} = require('../database/dataProvider')
cron.schedule(`*/${commitInterval} * * * *`, async () => {
    const repos = await getAll()
    repos.map(async (repo) => {
        if (!repo.allowAutoCommit) {
            return
        }
        let files = await getFiles(repo.path, repo.folderName)
        const filesToIgnore = await getGitIgnoreFiles(repo.path)
        files = files.filter(file => !filesToIgnore.includes(file.name) && !filesToIgnore.includes(file.path))
        repo.stagedFiles = files
        update(repo)
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
        nativeTheme.themeSource = 'dark'
        // window.webContents.openDevTools()
        buildContext(window, {repoId: repo.id, stagedFiles: repo.stagedFiles})
        atachCloseEvent(window)
    });

});