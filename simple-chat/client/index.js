const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const fs = require('fs')
const server = require('https').createServer({
    key: fs.readFileSync('keys/private.key').toString(),
    cert: fs.readFileSync('keys/certificate.crt').toString()
}, app)
const io = require('socket.io')(server)

app.use(express.json())
app.use(express.static('public'))
app.use(session({secret: "thisismysecret!"}))
app.set('view engine', 'ejs');

const users = require('./services/users')
app.use('/users', users())

const dashboard = require('./services/dashboard')
app.use('/dashboard', dashboard())

const rooms = require('./services/rooms')
app.use('/rooms', rooms())

const chats = require('./services/chats')
app.use('/chats', chats())

app.get('/', (req, res) => {
    console.log(req.session.token)
    res.redirect('/users/login')
})

server.listen(port,"0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});