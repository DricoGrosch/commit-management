const {app} = require('electron')
require('./services/eventDispatcher')
require('./services/cronjob')
require('./services/server')
const {init} = require('./services/init')
app.on('ready', async () => {
    init()
})


