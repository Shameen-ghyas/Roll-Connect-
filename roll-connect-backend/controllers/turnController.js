const Game = require('../models/gameSchema');

const nextTurn = async (req, res) => {
    try {
        const {gameId} = req.body;

        if (!gameId) {
            return res.status(400).json({ message: 'Game ID is required' });
        }
        const game = await Game.findOne({gameId});
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.gameStatus !== 'active') {
            return res.status(400).json({ message: 'Game is not active.' });
        }

        // dont move turn if waiting for pawnn move
        if (game.waitingForPawnMove) {
            return res.status(400).json({ message: 'Waiting for pawn move. Cannot advance turn.' });
        }

        // check if player gets extra turn
        if (game.extraTurn){
            game.extraTurn = false;
            game.extraTurnReason = null;
            game.waitingForPawnMove = false;
            game.diceValue = null;
            await game.save();
            return res.status(200).json({ message: `Extra turn granted. It's still ${game.players[game.currentTurn].playerName}'s turn.`,
                                     data: {
                currentTurn: game.currentTurn,
                // currentPlayer: game.players[game.currentTurn].playerName,
                extraTurn: false,   
            } 
        });
        }
        // advance turn
        
        const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
        game.currentTurn = nextTurnIndex;
        game.consecutiveSixes = 0;
        game.extraTurnReason = null;
        game.extraTurn = false;
        game.diceValue = null;
        game.waitingForPawnMove = false;
        await game.save();

        res.status(200).json({
            message: `Turn moved to ${game.players[nextTurnIndex].playerName}`,
            data: {
                currentTurn: game.currentTurn,
                currentPlayer: game.players[nextTurnIndex].playerName,
                gameId: game.gameId
            }
        });
    }catch (error){
        console.error('Error in NextTurn', error);
        res.status(500).json({error: "failed to move to next turn"});
    }
};

module.exports = {
    nextTurn
};
    
