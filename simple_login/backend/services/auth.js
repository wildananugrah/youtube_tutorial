const express = require('express')
const router = express.Router()
var jwt = require('jsonwebtoken');

module.exports = () => {
    
    const secret = "thisismysecret"

    router.post('/generate', (req, res) => {
        
        try {
            const userId = req.body.userId

            const token = jwt.sign({
                userId: userId
              }, secret, { expiresIn: 60 * 60 * 24 * 365 });

            res.status(200).json({ 'token': Buffer.from(token).toString('base64') })

        } catch (err) {
            console.log(err)
            res.status(500).json({'message': 'GENERAL ERROR!'})
        }
    })
    
    router.post('/verify', (req, res) => {
        try {
            
            const token = req.body.token
            var decoded = jwt.verify(Buffer.from(token, 'base64').toString('ascii'), secret);

            res.status(200).json({ 'userId': decoded.userId })
            
        } catch (err) {
            console.log(err)
            res.status(500).json({'message': 'GENERAL ERROR!'})
        }
    })

    return router

}