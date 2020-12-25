const $ = require('jQuery');
const {ipcRenderer, ipcMain} = require('electron')
const fs = require('fs')
fs.readFile('src/components/globals/imports.html', 'utf8', function (err, html) {
    $('head').append(html)
})
