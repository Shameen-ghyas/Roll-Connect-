const Game = require('../models/gameSchema');

const rollDice = async (req, res) => {
    try {
        const { gameId, playerName } = req.body;

        if (!gameId || !playerName) {
            return res.status(400).json(
                { message: 'Game ID and player name are required' }
            );
        }
        const game = await Game.findOne({
            gameId: gameId,
        });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        // check if game is active
        if (game.gameStatus !== 'active') {
            return res.status(400).json({ message: 'Game is not active. Cannot roll dice.' });
        }
        // check if it's the player's turn
        const currentPlayer = game.players[game.currentTurn];

        if (currentPlayer.playerName !== playerName) {
            return res.status(400).json({ message: `Not your turn! It's ${currentPlayer.playerName}'s to roll the dice.` });
        }

        if (game.waitingForPawnMove) {
            return res.status(400).json({
                error: "Please move a pawn first before rolling again"
            });
        } 
         // roll the dice
        const diceValue = Math.floor(Math.random() * 6) + 1;

        if (diceValue === 6) {
            game.consecutiveSixes += 1;
            if (game.consecutiveSixes >=3 ) {

                const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
                game.currentTurn = nextTurnIndex;
                game.consecutiveSixes = 0;
                game.diceValue = null,
                game.extraTurn = null,
                game.waitingForPawnMove = false;

                await game.save();

                return res.status(200).json({
                    message: `${playerName} rolled three 6's! Turn Lost.`,
                    data: {
                        diceValue: 6,
                        penalty: true,
                        currentTurn: game.currentTurn,
                        currentPlayer: game.players[game.currentTurn].playerName,
                        nextAction: 'turn ended'
                    }
                });
            }
        } else {
            game.consecutiveSixes = 0;
        }

        game.diceValue = diceValue;
        game.lastRoll = {
            playerName: playerName,
            timestamp: new Date()
        };

        if (diceValue === 6) {
            game.extraTurn = true;
            game.extraTurnReason = 'rolled a six';
        } else {
            game.extraTurn = false;
            game.extraTurnReason = null;
        }

        // check if player has any valid moves
        const hasValidMoves = checkValidMoves(currentPlayer, diceValue);

        if (!hasValidMoves) {
            const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
            game.currentTurn = nextTurnIndex;
            game.consecutiveSixes = 0;
            game.extraTurn = false;
            game.diceValue = null;
            game.waitingForPawnMove = false;

            await game.save();
            return res.status(200).json({
                success: true,
                message: `${playerName} rolled ${diceValue} but has no valid moves. Turn skipped.`,
                data: {
                    diceValue: diceValue,
                    noMoves: true,
                    currentTurn: game.currentTurn,
                    currentPlayer: game.players[game.currentTurn].playerName,
                    nextAction: 'turn_ended'
                }
            });
        }

        // player has valid moves - wait or pawn selection
        game.waitingForPawnMove = true;
        await game.save();

        res.status(200).json({
            success: true,
            message: `${playerName} rolled a ${diceValue}`,
            data: {
                diceValue: diceValue,
                playerName: playerName,
                currentTurn: game.currentTurn,
                gameId: game.gameId,
                extraTurn: game.extraTurn,
                extraTurnReason: game.extraTurnReason,
                consecutiveSixes: game.consecutiveSixes,
                nextAction: 'move_pawn'
            }
        });
    } catch (error) {
        console.error('Error rolling a dice:', error);
        res.status(500).json({error: "Failed to roll dice"});
    }
};

// helper function
// check if player has valid moves 
function checkValidMoves(player, diceValue) {
    // check if any pawn can move 
    
    if (diceValue === 6) {
        return true;
    }

    // if any pawn is already on the board
    const pawnsOnBoard = player.pawns.filter(p => p.position >= 0 && p.position < 58);
    if (pawnsOnBoard.length > 0) {
        return pawnsOnBoard.some(pawn => {
            const newPos = pawn.position + diceValue; 
            return newPos <= 58
        });
    }

    return false; 
}

module.exports = {
    rollDice
};
       
        

        

        
       