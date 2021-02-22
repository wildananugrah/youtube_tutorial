const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs')
const server = require('https').createServer({
    key: fs.readFileSync('keys/private.key').toString(),
    cert: fs.readFileSync('keys/certificate.crt').toString()
}, app)

// configs
const DBHOST = process.env.DBHOST || 'localhost';
const DBPORT = process.env.DBPORT || '27017';
const DBNAME = process.env.DBNAME || 'simplechatdb';
const DBPOOLSIZE = process.env.DBPPOLSIZE || '20';

app.use(express.json())
app.use(cors())

MongoClient.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}?poolSize=${DBPOOLSIZE}&writeConcern=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
        if (err) throw err;

        let database = client.db('simplechatroomsdb')

        const users = require('./services/users')
        app.use('/api/v1/users', users(database))

        const rooms = require('./services/rooms')
        app.use('/api/v1/rooms', rooms(database))

        const chats = require('./services/chats')
        app.use('/api/v1/chats', chats(database))

        server.listen(port, "0.0.0.0", () => {
            console.log(`Listening on port ${port}`);
        });

    });