const express = require('express')
const app = express()
const path = require('path')
const db = require('./database/db')
const auth = require('./Controller/auth')

app.use(express.json())
app.use('/auth', auth)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'lms', 'src', 'login.html'))
})

app.get('/names', (req, res) => {
    res.send('hello')
})

app.listen(3000, (err) => {
    if(err){
        console.log('server failed')
    }else{
        console.log('server started successfully at port 3k')
    }
})