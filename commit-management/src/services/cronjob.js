const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
const {buildContext, atachCloseEvent} = require("./eventDispatcher");
const {BrowserWindow, app} = require('electron')
const {getAll, update} = require('../database/dataProvider')
//chato pra krl, deixa comentado
// cron.schedule(`*/${commitInterval} * * * *`, async () => {
//     const repos = await getAll()
//     repos.map(async (repo) => {
//         if (!repo.allowAutoCommit) {
//             return
//         }
//         const window = new BrowserWindow({
//             width: 500,
//             height: 200,
//             title: repo.name,
//             webPreferences: {
//                 nodeIntegration: true
//             }
//         })
//         window.loadFile('src/components/windows/commitConfirmation.html')
//         window.setMenu(null)
//         window.webContents.openDevTools()
//         buildContext(window, {repoId: repo.id, stagedFiles: repo.stagedFiles})
//
//         window.on('focus', (event) => {
//             console.log('focus')
//             event.sender.webContents.send('window-focus')
//         })
//         window.on('blur', (event) => {
//             console.log('blur')
//             event.sender.webContents.send('window-blur')
//         })
//     });
//
// });