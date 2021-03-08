async function getCurrentUser() {
    const response = await global.octokit.request('GET /user')
    // const email_resp = await global.octokit.request('GET /user/public_emails')
    return response.data
}

module.exports = {
    getCurrentUser
}