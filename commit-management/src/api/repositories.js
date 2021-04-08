async function createRepo(name) {
    try {

        let response = await global.octokit.request('POST /user/repos', {
            name,
            auto_init: true
        })
        console.log('repository created successfully on origin')
        return response.data
    } catch (e) {
        return null
    }
}

module.exports = {
    createRepo
}