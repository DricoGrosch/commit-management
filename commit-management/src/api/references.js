
async function listReferences(repoName, owner, branchName = '') {
    const response = await global.octokit.request('GET /repos/{owner}/{repo}/git/matching-refs/{ref}', {
        owner: owner,
        repo: repoName,
        ref: `heads/${branchName}`,
    })
    return response.data
}

async function updateReference(repoName, owner, branchName, newCommitSha) {
        const response = await global.octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
            owner,
            repo: repoName,
            ref: `heads/${branchName}`,
            sha: newCommitSha,
            force: true
        })
    return response.data
}

async function createReference(repoName, owner, branchName, lastCommitSha) {
    const response = await global.octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
        owner,
        repo: repoName,
        ref: `refs/heads/${branchName}`,
        sha: lastCommitSha
    })
    return response.data
}


module.exports = {
    updateReference,
    createReference,
    listReferences
}