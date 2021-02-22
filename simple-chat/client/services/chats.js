const express = require('express')
const router = express.Router()
const axios = require('axios').default
const https = require('https')
axios.defaults.baseURL = 'https://app-server-chat:3001/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = () => {

    router.post('/', (req, res) => {
        try {

            let data = {
                "roomId": req.body.roomId,
                "sentBy": req.body.sentBy,
                "message": req.body.message
            }

            axios.post('/chats', data, { httpsAgent: agent, headers: {authorization: `Token ${req.session.token}`}}).then((response) => {
                res.status(200).json(response.data)
            }).catch((error) => {
                console.log(error.response)
                res.status(error.response.status).json({ 'message': 'can not add!' })
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/:roomId', (req, res) => {
        try {

            axios.get('/chats/' + req.params.roomId, { httpsAgent: agent, headers: {authorization: `Token ${req.session.token}`}}).then((response) => {
                console.log(response.data)
                res.status(200).json(response.data)
            }).catch((error) => {
                console.log(error.response)
                res.status(error.response.status).json({ 'message': 'can not get!' })
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    return router
}