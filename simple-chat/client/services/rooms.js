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

    router.get('/', (req, res) => {
        try {
            axios.get('/rooms', { httpsAgent: agent, headers: {"Authorization": `Token ${req.session.token}`}}).then((response) => {
                res.status(200).json(response.data)
            }).catch((error) => {
                res.status(500).json({ 'message': 'can not get!' })
            })

        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/:roomId', (req, res) => {
        try {
            if (req.session.token == null || req.session.token == 'undefined') {
                res.redirect('/')
            }
            else {
                let roomId = req.params.roomId
                let email = req.session.email

                res.render('rooms', { title: 'Rooms', roomId: roomId, email: email })
            }
        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.delete('/', (req, res) => {
        try {
            let data = { "roomId": req.body.roomId }
            console.log('request: ' + JSON.stringify(data))
            console.log('token: ' + req.session.token)

            axios.delete('/rooms/' + req.body.roomId, { httpsAgent: agent, headers: { authorization: `Token ${req.session.token}` } }).then((response) => {
                res.status(200).json(response.data)
            }).catch((error) => {
                console.log(error)
                res.status(500).json({ 'message': 'can not delete!' })
            })

        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/', (req, res) => {
        try {

            let data = { 'roomName': req.body.roomName }

            axios.post('/rooms', data, { httpsAgent: agent, headers: { authorization: `Token ${req.session.token}` } }).then((response) => {
                res.status(200).json(response.data)
            }).catch((error) => {
                res.status(500).json({ 'message': 'can not add!' })
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    return router
}