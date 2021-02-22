const express = require('express')
const router = express.Router()
const axios = require('axios').default

axios.defaults.baseURL = 'https://app-server-chat:3001/api/v1';
axios.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = () => {
    
    router.get('/', (req, res) => {
        try{
            if(req.session.token == null || req.session.token == 'undefined')
            {
                res.redirect('/')
            }
            else{
                res.render('dashboard', { title: "Dashboard", email: req.session.email })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })

    router.get('/logout', (req, res) => {
        try{
            req.session.destroy((err) => {
                console.log(err)
                res.redirect('/')
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ 'message': 'GENERAL ERROR!' })
        }
    })
    
    return router
}