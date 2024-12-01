const express = require('express');
const router = express.Router();
const { register, login } = require('../Auth/authentication');

router.post('/register', register);
router.post('/login', login);

const CookieCheck = (req, res, next) => {
    if (req.session.name) {
        console.log('Session valid for user:', req.session.name);
        next();
    } else {
        console.log('No session found, redirecting to login.');
        res.redirect('http://localhost:5173/login');
    }
};

// Apply middleware to protected routes
router.get('/profile', CookieCheck, (req, res) => {
    res.json({ message: 'Welcome to your profile', user: req.session.name });
});

module.exports = router;
