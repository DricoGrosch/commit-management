const {ACCESS_TOKEN} = require('../../env.json')
const {Octokit} = require("@octokit/core");
const octokit = new Octokit({auth: ACCESS_TOKEN});


async function create(name) {
    let response = await octokit.request('POST /user/repos', {
        name
    })
    return response.data
}


async function push() {
}


module.exports = {
    create,
    push
}