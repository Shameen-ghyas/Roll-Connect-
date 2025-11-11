const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema.js');
const { v4: uuidv4 } = require('uuid');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL    
        },

        async (accessToken, refreshToken, profile, done) => {
            try{
                console.log('Google PRofile:', profile);

                let user = await User.findOne({googleId: profile.id});
                if (user) {
                    console.log("Exisitng user found:", user.username);
                    return done(null, user);
                }

                // create new user

                user = new User ({
                    userId: uuidv4(),
                    username: profile.displayName,
                    authType: 'google',
                    googleId: profile.id,
                    totalWins: 0,
                    totalGamesPlayed: 0, 
                    coins: 0,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value, 
                });

                await user.save();
                console.log("New user created :", user.username);
                done (null, user);
            }catch (err) {
                console.error("Error in Google Strategy:", err);
                done(err, null);
            }
        }
    )
);

// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from ID stored in session)
passport.deserializeUser(async (id, done) => {
    try {  
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }   
    });

module.exports = passport;