const express = require('express');
const router = express.Router();
const passport = require('passport');
const { guestLogin, googleLoginSuccess , logout} = require('../controllers/authController');

//guest login route
router.post('/guest', guestLogin);

//google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//google OAuth callback route
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5500/login?error=authentication_failed' }),
    googleLoginSuccess
);

//logout route
router.post('/logout', logout);

//check if the user is authenticated
router.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ 
            authenticated: true,
            user: {
                userId: req.user.userId,
                username: req.user.username,
                email: req.user.email,
                authType: req.user.authType,
                totalWins: req.user.totalWins,
                coins: req.user.coins
            }
         });
    } else {
        res.json({authenticated: false});
    }         
        

});

module.exports = router;
