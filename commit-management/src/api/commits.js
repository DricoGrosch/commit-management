const {createReference, updateReference, listReferences} = require('./references')
const moment = require('moment')
const octokit = global.octokit


async function createTree(repoName, owner, files) {
    const commitTree = files.map(file => {
        return {
            path: file.relativePath,
            type: 'blob',
            mode: '100644',
            content: file.content.toString('base64')
        }
    })
    let response = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
        owner,
        repo: repoName,
        tree: commitTree
    })
    console.log('commit tree created successfully')
    return response.data
}

async function createCommit(repoName, owner, tree, branchName) {
    const response = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
        owner,
        repo: repoName,
        message:`Auto commit ${moment().format('YYYY-MM-DD HH:MM')} by ${owner}`,
        tree: tree.sha
    })
    const references = await listReferences(repoName, owner, branchName)
    let reference = references.find(({ref})=>ref===`refs/heads/${branchName}`)
    if (!reference) {
        await createReference(repoName, owner, branchName, response.data.sha)
    } else {
        await updateReference(repoName, owner, branchName, response.data.sha)
    }
    console.log('commit created successfully')

    return response.data
}

module.exports = {
    createTree,
    createCommit
}