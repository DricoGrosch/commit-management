const octokit = global.octokit
async function createRepo(name) {
    let response = await octokit.request('POST /user/repos', {
        name,
        auto_init: true
    })
    console.log('repository created successfully on origin')
    return response.data
}

module.exports = {
    createRepo
}