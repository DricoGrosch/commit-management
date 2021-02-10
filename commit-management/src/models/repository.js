const dataProvider = require('../database/dataProvider')
const fs = require('fs')
const repositories = require('../api/repositories')
const commits = require('../api/commits')
const {transformPath, initializeRepository} = require('../services/folderManager')
const {repositoriesFolder} = require('../../env.json')
const chokidar = require('chokidar')


module.exports = {
    createRepository,
    commit,
    loadRepos
}

