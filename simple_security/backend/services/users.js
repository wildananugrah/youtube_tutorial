const express = require('express')
const router = express.Router()
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios').default

module.exports = (client, dbname) => {

    database = client.db(dbname)
    collection = database.collection('users')

    axios.defaults.baseURL = 'http://localhost:3000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    const service = "users";

    router.delete('/', (req, res) => {
        try {

            const userId = req.body.userId;
            const query = { 'userId':userId };

            const method = "DELETE";
            let token = null;
            try{
                token = req.get('Authorization').split(" ")[1];
                axios.post("/auth/verify", { "token" : token, "method": method, "service": service }).then((response) => {
                    console.log(response.data);
                    if(response.data.authorized == true)
                    {
                        collection.find(query).toArray((err, dbresult) => {
                            if (err) {
                                console.log(err)
                                res.status(400).json({ 'message': 'DATABASE ERROR!' })
                            }    
                            if (dbresult.length == 1) {
                                if(dbresult[0].userId != response.data.userId)
                                {
                                    collection.deleteOne(query, (err, dbresult) => {
                                        if (err) throw err;
    
                                        res.status(200).json({ 'message': `${dbresult.deletedCount} data has been deleted successfully` });
                                    })
                                }
                                else
                                {
                                    res.status(200).json({ 'message': `this action is not allowed.` });
                                }                                
                            }
                            else {
                                res.status(400).json({ 'message': `userId doesnt exist!` });
                            }
                        });
                    }
                    else
                    {
                        res.status(400).json({ 'message': `un-authorized for service: ${service} method: ${method}` });
                    }
                }).catch((error) => {
                    console.log(error.response.data);
                });
            }
            catch (err)
            {
                console.log(err)
                res.status(500).json({ 'message': 'TOKEN ERROR!' })
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    });

    router.put('/:userId', (req, res) => {
        try {

            const userId = req.params.userId;
            const query = { 'userId':userId };

            const newValues = {
                "username": req.body.username,
                "roleAccess": req.body.roleAccess
            }

            const method = "PUT";
            let token = null;
            try{
                token = req.get('Authorization').split(" ")[1];
                axios.post("/auth/verify", { "token" : token, "method": method, "service": service }).then((response) => {
                    
                    if(response.data.authorized == true)
                    {
                        axios.post("/auth/validate/signature", {"signature": req.get("Signature"), "content": req.body}).then((response) => {
                            if(response.data.signature == true)
                            {
                                collection.find(query).toArray((err, dbresult) => {
                                    if (err) {
                                        console.log(err)
                                        res.status(400).json({ 'message': 'DATABASE ERROR!' })
                                    }    
                                    if (dbresult.length == 1) {
                                        if(dbresult[0].userId != response.data.userId)
                                        {
                                            collection.updateOne(query, {"$set": {newValues}},  (err, dbresult) => {
                                                if (err) throw err;
                                                res.status(200).json({ 'message': `${dbresult.modifiedCount} data has been modified successfully` });
                                            })
                                        }
                                        else
                                        {
                                            res.status(400).json({ 'message': `this action is not allowed.` });
                                        }                                
                                    }
                                    else {
                                        res.status(400).json({ 'message': `userId doesnt exist!` });
                                    }
                                });
                            }
                            else
                            {
                                res.status(400).json({ 'message': `INVALID SIGNATURE` });
                            }
                            
                        }).catch((error) => {
                            console.log(error.response.data);
                            res.status(400).json({ 'message': `ERROR SIGNATURE` });
                        })
                    }
                    else
                    {
                        res.status(400).json({ 'message': `un-authorized for service: ${service} method: ${method}` });
                    }
                }).catch((error) => {
                    console.log(error.response.data);
                    res.status(400).json({ 'message': `TOKEN ERROR!` });
                });
            }
            catch (err)
            {
                console.log(err)
                res.status(500).json({ 'message': 'TOKEN ERROR!' })
            }

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    });

    router.post('/register', (req, res) => {

        try {
            const username = req.body.username
            const password = req.body.password
            const roleAccess = req.body.roleAccess
            const userId = uuidv4()

            const data = { 'username': username, 'password': md5(password), 'roleAccess': roleAccess, 'userId': userId }

            console.log(`payload: ${JSON.stringify(data)}`)

            collection.find({ 'username': username }).toArray((err, result) => {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }

                if (result.length == 0) {
                    collection.insertOne(data, (err, dbresult) => {
                        if (err) throw err
                        res.status(200).json({ 'message': `${dbresult.insertedCount} data has been inserted successfully` })
                    })
                }
                else {
                    res.status(400).json({ 'message': `username: ${username} exists!` })
                }
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.post('/login', (req, res) => {
        try {
            const username = req.body.username
            const password = req.body.password
            const data = { 'username': username, 'password': md5(password) }
            console.log(`payload: ${JSON.stringify(data)}`)

            collection.findOne(data, function (err, result) {
                if (err) {
                    console.log(err)
                    res.json({ 'message': 'DATABASE ERROR!' })
                }

                if (result) {
                    axios.post("/auth/generate", { "userId" : result.userId, "roleAccess": result.roleAccess }).then((response) => {
                        res.status(200).json({ "token" : response.data.token });
                    }).catch((error) => {
                        console.log(error.response.data);
                    })
                }
                else {
                    res.status(404).json({ 'code': 404, 'data': 'invalid username/password' });
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' });
        }
    })

    return router

}