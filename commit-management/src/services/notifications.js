const {Notification} = require('electron')

async function showNotification(options, clickCallback) {
    const notification = new Notification(options)
    notification.on('click', clickCallback)
    return notification
}

module.exports = {
    showNotification
}