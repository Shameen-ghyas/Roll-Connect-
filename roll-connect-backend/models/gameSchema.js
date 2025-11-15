const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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
            playerName: {
                type: String,
                required: true
            },

            color: {
                type: String,
                enum: ['red', 'blue', 'green', 'yellow'],
                required: true
            },
            pawns: [
                {
                    pawnId: { type: Number, required: true },
                    position: { type: Number, default: -1 },
                    isHome: { type: Boolean, default: false }
                }
            ],
            score: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },

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

    diceValue: {
        type: Number,
        default: null,
        min: 1,
        max: 6
    },

    lastRoll: {
        playerName: String,
        timestamp: Date 
    }, 

    consecutiveSixes: {
        type: Number,
        default: 0
    },

    extraTurn: {
        type: Boolean,
        default: false
    },

    extraTurnReason: {
        type: String,
        default: null,  
        enum: ['rolled a six', 'captured a pawn','pawn_finished', null]
    },

    waitingForPawnMove: {
        type: Boolean,
        default: false
    },

    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Game', gameSchema); 