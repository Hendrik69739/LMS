const express = require('express');
const router = express.Router();
const { register, login } = require('../Auth/authentication');

// Define routes
router.post('/register', register);
router.post('/login', login);

router.post('/upload', )

module.exports = router;