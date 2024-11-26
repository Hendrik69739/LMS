const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {register, login, checkIfLoggedIn} = require('../Auth/authentication')

router.post('/register', register)
router.post('/login', login)

const CookieCheck = (req, res, next) => {
    if(req.session.name){
        next();
        console.log('cookies available')
    }
    else{
    res.redirect('http://localhost:3000/login');
    }
}

router.get('/profile', CookieCheck, (req, res) => {
    res.redirect('http://localhost:5173');
})

module.exports = router;