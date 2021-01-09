const {app} = require('electron')
require('./services/eventDispatcher')
require('./services/cronjob')
require('./services/server')
require('./database/config')
const {init} = require('./services/init')
app.on('ready', async () => {
    init()
})


