const cron = require('node-cron');
const {commitInterval} = require('../../env.json')
cron.schedule(`*/${commitInterval} * * * *`, () => {
    console.log('committing...');
});