const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    userId: {
        type: String,
        required: true, 
        unique: true
    },
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: false,
        sparse: true     
    },
    authType: {
        type: String,
        enum: ['guest', 'google'],
        required: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    totalWins: {
        type: Number,
        default: 0
    },
    totalGamesPlayed: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);