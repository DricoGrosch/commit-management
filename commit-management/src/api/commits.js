const {ACCESS_TOKEN} = require('../../env.json')
const {Octokit} = require("@octokit/core");
const octokit = new Octokit({auth: ACCESS_TOKEN});
const references = require('references')


async function createTree(repoName, owner, files) {
    const commitTree = files.map(file => {
        return {
            path: file.path,
            type: 'blob',
            mode: '100644',
            content: file.content
        }
    })
    let response = await octokit.request(`POST /repos/${owner.login}/${repoName}/git/trees`, {
        owner,
        repo: repoName,
        tree: commitTree
    })
    return response.data
}

async function createCommit(repoName, owner, tree, branchName) {

    const response = await octokit.request(`POST /repos/${owner.login}/${repoName}/git/commits`, {
        owner,
        repo: repoName,
        message: 'first auto commit',
        tree: tree.sha
    })
    return response.data
}

module.exports = {
    createTree,
    createCommit
}