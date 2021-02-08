
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
var cors = require('cors')

// set express json
app.use(express.json())

// cors
app.use(cors())

// database
MongoClient.connect(`mongodb://${process.env.DBHOST || 'localhost'}:${process.env.DBPORT || '27017'}/leadsdb?poolSize=${process.env.DBPPOLSIZE || '20'}&writeConcern=majority`,{ useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;

    // Start the application after the database connection is ready

    // users services
    const users = require('./services/users')
    app.use('/users', users(client))

    // auth services
    const auth = require('./services/auth')
    app.use('/auth', auth())

    // open listener
    app.listen(3000,"0.0.0.0", () => {
        console.log("Listening on port 3000");
    });
    
});
