const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    mode: {
        type: String,
        enum: ['offline', 'online'],
        required: true
    },
    players: [
        {
            playerName: { type: String, 
            required: true  },
            
            color: {
                type: String,
                enum: ['red', 'blue', 'green', 'yellow'],
                required: true
            },
            pawns: [
                {
                    pawnId: {type: String, required: true },
                    position: { type: Number, default: -1}, 
                    isHome: { type: Boolean, default: false}
                }
            ],
            score: { type: Number, default: 0 },
            wins: { type: Number, default:0 }
        }
    ],

    gameStatus: {
        type: String, 
        enum: ['waiting', 'active', 'completed'],
        default: 'waiting'  
    },

    currentTurn: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now()}
});

module.exports = mongoose.model('Game', gameSchema); 