const $ = require('jQuery');
const {ipcRenderer, ipcMain} = require('electron')
const fs = require('fs')
fs.readFile('src/uiPages/globals/imports.html', 'utf8', function (err, html) {
    $('head').append(html)
})
