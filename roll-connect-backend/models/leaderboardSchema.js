const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    userId: {                          
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    playerName: { type: String, required: true},
    score: { type: Number, required: true}, 
}, { timestamps: true });  

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
