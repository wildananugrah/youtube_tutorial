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

    router.get('/login', (req, res) => {
        try {
            res.render('login', { title: "Login" })
        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/register', (req, res) => {
        try {
            res.render('register', { title: "Register" })
        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/register', async (req, res) => {
        try {

            let email = req.body.email
            let password = req.body.password

            let data = {
                'email': email,
                'password': password
            }

            console.log(`request: ${JSON.stringify(data)}`)

            axios.post('/users/register', data, { httpsAgent: agent }).then((response) => {
                console.log('response: data has been inserted.')
                res.status(200).json({ 'message': 'success' })
            }).catch((error) => {
                console.log('response: error!.')
                res.status(error.response.status).json({ 'message': 'invalid username or password!' })
            })

        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/login', async (req, res) => {
        try {

            let email = req.body.email
            let password = req.body.password

            let data = {
                'email': email,
                'password': password
            }

            axios.post('/users/login', data, { httpsAgent: agent }).then((response) => {
                req.session.token = response.data.token
                req.session.email = email
                res.status(200).json({ 'message': 'success' })
            }).catch((error) => {
                console.log(error)
                res.status(500).json({ 'message': 'invalid username or password!' })
            })

        } catch (err) {
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    return router
}