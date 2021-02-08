const express = require('express')
const router = express.Router()
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios').default

module.exports = (client) => {

    database = client.db('leadsdb')
    collection = database.collection('users')

    axios.defaults.baseURL = 'http://localhost:3000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    router.post('/register', (req, res) => {

        try {
            const username = req.body.username
            const password = req.body.password
            const status = req.body.status
            const userId = uuidv4()

            const data = { 'username': username, 'password': md5(password), 'status': status, 'userId': userId }

            console.log(`payload: ${JSON.stringify(data)}`)

            collection.find({ 'username': username }).toArray(function (err, result) {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }

                if (result.length == 0) {
                    collection.insertOne(data, function (err, dbresult) {
                        if (err) throw err
                        res.status(200).json({ 'message': `${dbresult.insertedCount} data has been inserted successfully` })
                    })
                }
                else {
                    res.status(400).json({ 'message': `username: ${username} exists!` })
                }
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/login', (req, res) => {
        try {
            const username = req.body.username
            const password = req.body.password
            const data = { 'username': username, 'password': md5(password) }
            console.log(`payload: ${JSON.stringify(data)}`)

            collection.findOne(data, function (err, result) {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }

                if (result) {

                    axios.post('/auth/generate', {
                        userId: result.userId
                    })
                    .then(function (response) {
                        res.status(200).json({ 'token': response.data.token })
                    })
                    .catch(function (error) {
                        console.log(error)
                        res.json({
                            'message': "GENEREATE TOKEN ERROR!"
                        })
                    });

                }
                else {
                    res.status(404).json({ 'code': 404, 'data': 'invalid username/password' })
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    return router

}