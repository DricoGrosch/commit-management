const {createReference, updateReference, listReferences} = require('./references')
const moment = require('moment')
const StagedFile = require("../database/entities/StagedFile");
const fs = require("fs");


async function createTree(repoName, owner, files, branchName) {
    const references = await listReferences(repoName, owner, branchName)
    let reference = references.find(({ref}) => ref === `refs/heads/${branchName}`)
    const lastCommit = await getCommit(owner, repoName, reference.object.sha)
    const commitTree = files.map(file => {
        const item = {
            path: file.relativePath,
            type: 'blob',
            mode: '100644',
        }
        if (file.status === StagedFile.REMOVED) {
            item.sha = null
        } else {
            item.content = fs.readFileSync(file.fullPath, 'utf8')
        }
        return item
    })
    let response = await global.octokit.request('POST /repos/{owner}/{repo}/git/trees', {
        owner,
        repo: repoName,
        base_tree: lastCommit.tree.sha,
        tree: commitTree
    })
    console.log('commit tree created successfully')
    return response.data
}

async function createCommit(repoName, owner, tree, branchName) {
    const response = await global.octokit.request('POST /repos/{owner}/{repo}/git/commits', {
        owner,
        repo: repoName,
        message: `Auto commit ${moment().format('YYYY-MM-DD HH:MM')} by ${owner}`,
        tree: tree.sha
    })
    const references = await listReferences(repoName, owner, branchName)
    let reference = references.find(({ref}) => ref === `refs/heads/${branchName}`)
    if (!reference) {
        await createReference(repoName, owner, branchName, response.data.sha)
    } else {
        await updateReference(repoName, owner, branchName, response.data.sha)
    }
    console.log('commit created successfully')

    return response.data
}

async function getCommit(owner, repoName, commiSha) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner,
        repo: repoName,
        commit_sha: commiSha

    })
    return response.data

}

module.exports = {
    createTree,
    createCommit
}