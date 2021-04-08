const {Octokit} = require("@octokit/core");
async function createOctokit(token){
    return  new Octokit({auth: token});
}

module.exports = {createOctokit}