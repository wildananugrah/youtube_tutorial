const express = require('express')
const app = express()
const fs = require('fs')
const server = require('https').createServer({
    key: fs.readFileSync('keys/private.key').toString(),
    cert: fs.readFileSync('keys/certificate.crt').toString(),
    requestCert: false,
    rejectUnauthorized: false
}, app)
const cors = require('cors')
// const server = require('http').createServer(app)
const socketIO = require('socket.io')
const port = 3002

app.use(cors())

app.get("/", function(req, res){
    res.json({"message": "hello"})
})

server.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})

const io = socketIO(server, { cors: { origin : "*" } })

io.on('connection', (socket) => {
    console.log('connected!');
    socket.emit("server-send-message", "hi this is a message from server!")

    socket.on("client-send-broadcast", (userId, message) => {
        console.log(`message from ${userId}: ${message}`)
        socket.broadcast.emit("server-send-broadcast", userId, message);
    })

    socket.on('join-room', (roomId, email) => {
        console.log(`${email} join roomId: ${roomId} `)
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', email)
    })

    socket.on('client-message-room', (roomId, email, message) => {
        console.log(`message from ${email} in ${roomId}, message: ${message}`)
        socket.to(roomId).broadcast.emit("server-message-room", email, message)
    })

});