const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socketIO = require('socket.io')
const port = 3001
const cors = require('cors')

app.use(cors())

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const io = socketIO(server, { cors: { origin : "*" } })

io.on('connection', (socket) => {
    console.log('connected!');
    socket.emit("server-send-message", "hi this is a message from server!")

    socket.on("client-send-broadcast", (userId, message) => {
        console.log(`message from ${userId}: ${message}`)
        socket.broadcast.emit("server-send-broadcast", userId, message);
    })

});