const User = require('../models/userSchema.js');
const {v4: uuidv4} = require('uuid'); 

// guest login 

const guestLogin = async (req, res) => {
    try {
        const {username} = req.body;

        if (!username) {
            return res.status(400).json({error: "Username is required"});
        }
        // check if username already exists
        let user = await User.findOne({username: username, authType: 'guest'});

        if (!user) {
            // create new guest user
            user = new User({
                userId: uuidv4(),
                username: username,
                authType: 'guest',
                totalWins: 0,
                totalGamesPlayed: 0,
                coins: 0,
            }); 
            await user.save();

        }
        res.status(200).json({
            message: "Guest login successful",
            data: { 
                userId: user.userId,
                username: user.username,
                authType: user.authType,
                totalWins: user.totalWins,
                totalGamesPlayed: user.totalGamesPlayed,
                coins: user.coins,
            }
        });
        } catch (error) {
            console.error("Error in guest login:", error);
            res.status(500).json({error: "Guest login failed"});
        }
    };

// google login success callback

const googleLoginSuccess = (req, res) => {
    if (req.user) {
    //     res.redirect(`http://localhost:5500/game?user=${encodeURIComponent(JSON.stringify({
    //         userId: req.user.userId,
    //         username: req.user.username,
    //         email: req.user.email,
    //         authType: req.user.authType,
    //         totalWins: req.user.totalWins,
    //         coins: req.user.coins
    //     }))}`);    
        res.redirect(`http://localhost:5000/?user=${encodeURIComponent(JSON.stringify({
        userId: req.user.userId,
        username: req.user.username,
        email: req.user.email,
        authType: req.user.authType,
        totalWins: req.user.totalWins,
        coins: req.user.coins
    }))}`);
    } else {
        res.redirect('http://localhost:5500/login?error=authentication_failed');
    }
};

//logout 

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({error: 'Failed to logout'});
        }
        res.status(200).json({message: 'Logout successful'});
    });
}

module.exports = {guestLogin, googleLoginSuccess, logout};



