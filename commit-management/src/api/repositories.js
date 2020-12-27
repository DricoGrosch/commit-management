const {ACCESS_TOKEN} = require('../../env.json')
const {Octokit} = require("@octokit/core");
const octokit = new Octokit({auth: ACCESS_TOKEN});


async function createRepo(name) {
    let response = await octokit.request('POST /user/repos', {
        name,
        auto_init: true
    })
    return response.data
}

module.exports = {
    createRepo
}