const {app} = require('electron')
require('./services/eventDispatcher')
require('./services/server')
require('./database/config')
require('./services/cronjob')
const {init} = require('./services/init')
app.on('ready', async () => {
    init()
})


