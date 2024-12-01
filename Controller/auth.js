const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const {register, login, checkIfLoggedIn} = require('../Auth/authentication')

router.post('/register', register)
router.post('/login', login)


module.exports = router;