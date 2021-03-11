const moment = require('moment')
const Config = require('../database/entities/Config')
const Git = require('nodegit')
const path = require('path')
const fs = require('fs')
const repositories = require("../api/repositories");
const commits = require("../api/commits");
const {getCurrentUser} = require("../api/user");

async function clone(cloneUrl, name) {
    const config = await Config.getUserConfig()

    Git.Clone(cloneUrl, path.join(config.repositoriesFolder, name), {
            fetchOpts: {
                callbacks: {
                    credentials: function () {
                        return Git.Cred.userpassPlaintextNew(currentUser.login, config.accessToken);
                    },
                    certificateCheck: function () {
                        return 1;
                    }
                }
            }
        }
    ).then(function (repo) {
        return repo
    })
}

async function commit(repo, files) {
    const currentUser = await getCurrentUser()
    const config = await Config.getUserConfig()
    const index = await repo.refreshIndex(); // read latest
    files.forEach(file => {
        index.addByPath(file.path())
    });
    await index.write();
    const changes = await index.writeTree();
    let parent = null
    try {

        const head = await Git.Reference.nameToId(repo, "HEAD");
        parent = await repo.getCommit(head);
    } catch (e) {

    }
    const author = Git.Signature.now(currentUser.login, currentUser.email ?? '04175116982@edu.udesc.br');
    const committer = Git.Signature.now(currentUser.login, currentUser.email ?? '04175116982@edu.udesc.br');
    const commitId = await repo.createCommit("HEAD", author, committer, `Auto commit ${moment().format('YYYY-MM-DD HH:MM')} by ${currentUser.login}`, changes, parent ? [parent] : []);
    const currentBranch = await repo.getCurrentBranch()
    const branchReference = currentBranch.name()
    let remote;
    remote = await repo.getRemote("origin")
    try {
        console.log(remote.url())
        await remote.push([branchReference], {
            callbacks: {
                credentials: function () {
                    return Git.Cred.userpassPlaintextNew(currentUser.login, config.accessToken);
                },
            }
        })
    } catch (e) {
        console.log(e)
    }
}

async function create(name) {
    name = name.replaceAll(' ', '_')
    const repo = await repositories.create(name)
    await clone(repo.clone_url, repo.name)
    return repo
}

module.exports = {
    clone,
    create,
    commit
}