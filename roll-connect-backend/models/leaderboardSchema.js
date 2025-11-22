const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    userId: {                          
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Made optional for guest players
    },
    playerName: { 
        type: String, 
        required: true,
        unique: true  // Ensure one entry per player
    },
    score: { 
        type: Number, 
        required: true,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for faster sorting by score
leaderboardSchema.index({ score: -1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
