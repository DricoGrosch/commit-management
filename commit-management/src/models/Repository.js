const moment = require('moment')
const Config = require('../database/entities/Config')
const Git = require('nodegit')
const path = require('path')
const fs = require('fs')
const {getCurrentUser} = require("../api/user");

async function clone(cloneUrl, folderName) {
    const config = await Config.getUserConfig()

    Git.Clone(cloneUrl, path.join(config.repositoriesFolder, folderName), {
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
    const commitId = await repo.createCommit("HEAD", author, committer, `Auto commit ${moment().format('YYYY-MM-DD HH:MM')} by ${committer.name}`, changes, parent ? [parent] : []);
    const currentBranch = await repo.getCurrentBranch()
    const currentBranchname = currentBranch.name()
    const branchReference = currentBranchname
    let remote;
    try {
        remote = await repo.getRemote("origin")
    } catch (e) {
        remote = await Git.Remote.create(repo, "origin", `https://github.com/${currentUser.login}/teste_nodegit.git`)
    } finally {
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
            await Git.Remote.delete(repo, 'origin')
        }
    }
}

async function create(name) {
    const config = await Config.getUserConfig()
    const repoFolder = path.join(config.repositoriesFolder, name.replace(' ', '_'))
    const repo = await Git.Repository.init(repoFolder, 0);

    fs.writeFileSync(path.join(repoFolder, '.gitignore'))
    fs.writeFileSync(path.join(repoFolder, 'README.md'))
    await commit(repo, await repo.getStatus())
    return repo
}

module.exports = {
    clone,
    create,
    commit
}