const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ['offline', 'online'],
        required: true
    },
    players: [
        {
            playerName: { type: String, required: true  },
            score: { type: Number, default: 0 },
            wins: { type: Number, default:0 }
        }
    ],
    createdAt: { type: Date, defaut: Date.now()}
});

module.exports = mongoose.model('Game', gameSchema); 