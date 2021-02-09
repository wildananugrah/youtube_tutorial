const express = require('express')
const router = express.Router()
var jwt = require('jsonwebtoken');
const fs = require('fs');
const { decode } = require('punycode');


module.exports = () => {
    
    const privateKey = fs.readFileSync('services/keys/privateKey.key');
    const publicKey = fs.readFileSync('services/keys/publicKey.pem');

    const clientPublicKey = fs.readFileSync('services/keys/clientPublicKey.pem');

    router.post('/generate', (req, res) => {
        
        try {
            const userId = req.body.userId;
            const roleAccess = req.body.roleAccess;
            const token = jwt.sign({
                "userId": userId,
                "roleAccess": roleAccess
              }, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60 * 24 * 365 });

            res.status(200).json({ 'token': Buffer.from(token).toString('base64') });

        } catch (err) {
            console.log(err);
            res.status(500).json({'message': 'GENERAL ERROR!'});
        }
    });
    
    router.post('/verify', (req, res) => {
        try {
            
            const token = req.body.token;
            const service = req.body.service;
            const method = req.body.method;
            
            const decoded = jwt.verify(Buffer.from(token, 'base64').toString('ascii'), publicKey);

            let authorized = false;
            for(i = 0; i < decoded.roleAccess.length; i++)
            {
                if(decoded.roleAccess[i].hasOwnProperty(service) && decoded.roleAccess[i][service].includes(method))
                {
                    authorized = true;                    
                }
            }
            
            res.status(200).json({ 'authorized': authorized, "userId": decoded.userId });
            
        } catch (err) {
            console.log(err);
            res.status(500).json({'message': 'GENERAL ERROR!'});
        }
    });

    router.post('/validate/signature', (req, res) => {
        
        try {
            const content = req.body.content;
            const signature = req.body.signature;

            const decoded = jwt.verify(Buffer.from(signature, 'base64').toString('ascii'), clientPublicKey);

            console.log(decoded);

            if(JSON.stringify(content) == JSON.stringify(decoded))
            {
                res.status(200).json({ 'signature': true });
            }
            else
            {
                res.status(200).json({ 'signature': false });
            }
        } catch (err) {
            console.log(err);
            res.status(200).json({ 'signature': false });
        }
    });

    return router;

}