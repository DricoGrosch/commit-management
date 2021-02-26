const $ = require('jQuery');
const {ipcRenderer} = require('electron')
const fs = require('fs')
let CONTEXT = {}
// ipcRenderer.send('build-context')
ipcRenderer.on('build-context-reply', (event, data) => {
    CONTEXT = JSON.parse(data)
    console.log('context loaded')
    fs.readFile('src/components/globals/globals.html', 'utf8', function (err, html) {
        $('head').append(html)
    })
})