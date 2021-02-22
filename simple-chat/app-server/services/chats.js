const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const auth = require('./auth')


module.exports = (database) => {

    let collection = database.collection('chats')

    router.post('/', (req, res) => {
        try {
            if (!auth.validate(req.get('authorization'))) {
                res.status(401).json({ 'message': `invalid token` })
            } else {
                let data = {
                    "uid": uuidv4(),
                    "roomId": req.body.roomId,
                    "sentBy": req.body.sentBy,
                    "message": req.body.message,
                    "sentAt": Date.now()
                }

                console.log(data)

                collection.insertOne(data, (err, dbresult) => {
                    if (err) {
                        console.log(err)
                        res.json({ 'message': 'DATABASE ERROR!' })
                    }

                    res.status(200).json({ 'message': `${dbresult.insertedCount} data has been inserted successfully` })

                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/:roomId', (req, res) => {
        try {
            if (!auth.validate(req.get('authorization'))) {
                res.status(401).json({ 'message': `invalid token` })
            } else {
                collection.find({ "roomId": req.params.roomId }).sort({ "sentAt": -1 }).toArray((err, dbresult) => {
                    if (err) throw err

                    let data = []
                    for (var i = 0; i < dbresult.length; i++) {
                        data.push({
                            "roomId": dbresult[i].roomId,
                            "sentBy": dbresult[i].sentBy,
                            "message": dbresult[i].message,
                            "sentAt": dbresult[i].sentAt
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

    return router
}