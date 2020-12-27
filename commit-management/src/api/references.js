const {ACCESS_TOKEN} = require('../../env.json')
const {Octokit} = require("@octokit/core");
const octokit = new Octokit({auth: ACCESS_TOKEN});




async function getReference(repoName, owner, branchName) {
    await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
        owner,
        repo: repoName,
        ref: `refs/heads/${currentBranch}`,
    })
}

async function updateReferance() {

}

async function createReference(repoName, owner, branchName, lastCommitSha) {
    const response = await octokit.request(`POST /repos/${owner.login}/{repoName}/git/refs`, {
        owner,
        repo: repoName,
        ref: `refs/heads/${currentBranch}`,
        sha: lastCommitSha
    })
    return response.data
}


module.exports = {
    getReference,
    updateReferance,
    createReference

}