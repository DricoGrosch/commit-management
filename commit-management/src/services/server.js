const express = require('express'); //your express app
const axios = require('axios')
const {CLIENT_ID, CLIENT_SECRET} = require('../../app_config')
const {init} = require('./init')
let server = express()
server.listen(8000)
server.get('/callback', async (req, resp) => {
    const code = req.query.code
    const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
    })
    const access_token = response.data.split('&')[0].split('=')[1]
    init(access_token)
})

module.exports = server