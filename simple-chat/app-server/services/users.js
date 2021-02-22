const express = require('express')
const md5 = require('md5')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const auth = require('./auth')

module.exports = (database) => {

    let collection = database.collection('users')

    router.post('/login', (req, res) => {
        try{

            let email = req.body.email
            let password = md5(req.body.password)

            let data = { 'email': email, 'password': password }

            collection.findOne(data, (err, dbresult) => {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }
                
                if (dbresult) {
                    res.status(200).json({'token': auth.generate(dbresult.uid)})
                } else {
                    res.status(400).json({ 'message': `username or password invalid!` })
                }
                
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/register', (req, res) => {
        try{

            let email = req.body.email
            let password = md5(req.body.password)

            let data = {
                'uid': uuidv4(),
                'email': email,
                'password': password
            }

            collection.find({ 'email': email }).toArray((err, dbresult) => {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }

                if (dbresult.length == 0) {
                    collection.insertOne(data, (err, dbresult) => {
                        if (err) throw err
                        res.status(200).json({ 'message': `${dbresult.insertedCount} data has been inserted successfully` })
                    })
                }
                else {
                    res.status(400).json({ 'message': `email: ${email} exists!` })
                }
            })

        } catch(err){
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })
    
    return router
}