const axios = require('axios')
const {username} = require('../env.json')

class DataProvider {

    getAll = () => {

    }
    getOne = async (name) => {
        const response = await axios.get(`https://api.github.com/repos/${username}/${name}`)
    }
    create = async (name) => {
    }
    stage = () => {

    }
    commit = () => {

    }

}

export default new DataProvider()