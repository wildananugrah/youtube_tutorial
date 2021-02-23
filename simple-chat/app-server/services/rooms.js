const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const auth = require('./auth')

module.exports = (database) => {

    let collection = database.collection('rooms')

    router.post('/', (req, res) => {
        try {

            if (!auth.validate(req.get('authorization'))) {
                res.status(401).json({ 'message': `invalid token` })
            }
            else {
                let roomName = req.body.roomName
                let data = { 'roomId': uuidv4(), 'roomName': roomName }
                collection.find({ 'roomName': roomName }).toArray((err, dbresult) => {

                    if (dbresult.length == 0) {
                        collection.insertOne(data, (err, dbresult) => {
                            if (err) {
                                console.log(err)
                                res.json({ 'message': 'DATABASE ERROR!' })
                            }
                            else {
                                res.status(200).json({ 'message': `${dbresult.insertedCount} data has been inserted successfully` })
                            }
                        })
                    }
                    else {
                        res.status(400).json({ 'message': 'room name exists!' })
                    }

                })
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/', (req, res) => {
        try {

            console.log(req.get('authorization'))

            if (!auth.validate(req.get('authorization'))) {
                res.status(401).json({ 'message': `invalid token` })
            } else {
                collection.find({}).toArray((err, dbresult) => {
                    if (err) throw err

                    let data = []
                    for (var i = 0; i < dbresult.length; i++) {
                        data.push({
                            "roomId": dbresult[i].roomId,
                            "roomName": dbresult[i].roomName
                        })
                    }

                    res.json({ 'data': data })
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.delete('/:roomId', (req, res) => {
        try {
            console.log("delete.")
            console.log('auth: ' + req.get('authorization'))
            if (!auth.validate(req.get('authorization'))) {
                console.log('invalid token.')
                res.status(401).json({ 'message': `invalid token` })
            } else {
                let data = { 'roomId': req.params.roomId }
                console.log('request: ' + data)
                collection.deleteOne(data, (err, dbresult) => {
                    if (err) res.status(500).json({ 'message': 'DATABASE ERROR!' })

                    res.status(200).json({ 'message': '1 document deleted!' })

                })
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    return router
}