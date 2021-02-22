const jwt = require('jsonwebtoken')
const secret = "thisismysecret"

module.exports = {
    generate: (userId) => {
        try {

            let token = jwt.sign({
                userId: userId
            }, secret, { expiresIn: 60 * 60 * 24 * 365 }) // one year.
            return Buffer.from(token).toString('base64')

        } catch (err) {
            console.log(err)
            return false
        }
    },
    validate: (authorization) => {
        let token = authorization.split(' ')[1]
        try {
            return jwt.verify(Buffer.from(token, 'base64').toString('ascii'), secret);
        } catch (err) {
            console.log(err)
            return false
        }
    }
}