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

async function autoCommit(repo) {
    console.log('beginning commit')
    const currentUser = await getCurrentUser()
    const config = await Config.getUserConfig()
    const index = await repo.refreshIndex();
    let files = await repo.getStatus(); // get status of all files
    files.forEach(file => index.addByPath(file.path())); // stage each file
    await index.write();
    const changes = await index.writeTree();
    const head = await Git.Reference.nameToId(repo, "HEAD");
    const parent = await repo.getCommit(head);
    const author = Git.Signature.now(currentUser.login, currentUser.email ?? '04175116982@edu.udesc.br');
    const committer = Git.Signature.now(currentUser.login, currentUser.email ?? '04175116982@edu.udesc.br');
    await repo.createCommit("HEAD", author, committer, `Auto commit ${moment().format('YYYY-MM-DD HH:MM')} by ${currentUser.login}`, changes, [parent]);
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
        files = await repo.getStatus()
        console.log()
        console.log('pushed successfully')
    } catch (e) {
        console.log(e)
    }
}

async function transformFiles(files) {
    files = files.filter(file => !file.isIgnored() && (file.isModified() || file.isNew() || file.isDeleted())).map(file => {
        return {
            path: file.path(),
            status: {
                isDeleted: file.isDeleted() !== 0,
                isNew: file.isNew() !== 0,
                isModified: file.isModified() !== 0,
            },
        }
    })
    return files
}

async function create(name) {
    name = name.replaceAll(' ', '_')
    const repo = await repositories.create(name)
    await clone(repo.clone_url, repo.name)
    return repo
}

async function getName(repo) {
    let remoteObject = await repo.getRemote('origin');
    let remoteUrl = await remoteObject.url();
    let name = remoteUrl.split('/').pop()
    return name.split('.')[0]
}

module.exports = {
    clone,
    create,
    autoCommit,
    getName,
    transformFiles
}