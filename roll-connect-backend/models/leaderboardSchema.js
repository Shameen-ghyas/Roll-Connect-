const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    userId: {                          
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        unique: true
    },
    playerName: { 
        type: String, 
        required: true,
        unique: true},
    score: { type: Number, required: true}, 
    wins: {type: Number, default: 0},
}, { timestamps: true });  

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
