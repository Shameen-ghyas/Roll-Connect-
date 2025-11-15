const Game = require('../models/gameSchema');
const {updateLeaderboard} = require('../utils/leaderboardHelper');

const movePawn = async (req, res) => {
    try {
        const { gameId, playerName, pawnId } = req.body;

        if (!gameId || !playerName || pawnId === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const game = await Game.findOne({ gameId });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        if (game.gameStatus !== 'active') {
            return res.status(400).json({ error: 'Game is not active' });
        }

        // Find player and pawn
        const playerIndex = game.players.findIndex(p => p.playerName === playerName);
        if (playerIndex === -1) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const player = game.players[playerIndex];
        const pawn = player.pawns.find(p => p.pawnId === pawnId);
        if (!pawn) {
            return res.status(404).json({ error: 'Pawn not found' });
        }

        // Check if it's player's turn
        if (game.currentTurn !== playerIndex) {
            return res.status(400).json({ error: 'Not your turn' });
        }

        if (!game.diceValue) {
            return res.status(400).json({ error: 'Roll dice first' });
        }

        const diceValue = game.diceValue;

        // Check if pawn can enter (from start position -1)
        if (pawn.position === -1) {
            if (diceValue !== 6) {
                return res.status(400).json({ error: 'Need 6 to start' });
            }
            // Place pawn at starting position
            pawn.position = 0;
        } else {
            // Move pawn
            let newPosition = pawn.position + diceValue;

            // just move forward
            if (newPosition >= 1
            ) {
                // Reached home
                pawn.position = 57;
                pawn.isHome = true;
                 game.extraTurn = true;
                game.extraTurnReason = 'pawn_finished';
                
                console.log(`${playerName}'s pawn reached home! Extra turn granted.`);
            } else {
                pawn.position = newPosition;
            }
        }

        // Clear dice value and waiting state
        game.diceValue = null;
        game.waitingForPawnMove = false;

         const allPawnsHome = player.pawns.every(p => p.isHome === true);
        
        if (allPawnsHome && player.rank === null) {
            // Player just finished! Assign rank
            const finishedPlayers = game.players.filter(p => p.rank !== null);
            player.rank = finishedPlayers.length + 1;
            player.finishedAt = new Date();
            
            console.log(` ${playerName} finished with Rank ${player.rank}!`);
            
            // Check if game should end (only 1 player left without rank)
            const playersWithoutRank = game.players.filter(p => p.rank === null);
            
            if (playersWithoutRank.length === 1) {
                // Last player gets last rank automatically
                const lastPlayer = playersWithoutRank[0];
                lastPlayer.rank = game.players.length;
                lastPlayer.finishedAt = new Date();
                
                // Game is now complete!
                game.gameStatus = 'completed';
                game.endTime = new Date();
                
                // Calculate final rankings
                const rankings = game.players
                    .sort((a, b) => a.rank - b.rank)
                    .map(p => ({
                        playerName: p.playerName,
                        color: p.color,
                        rank: p.rank
                    }));
                
                console.log(' Game completed! Final Rankings:', rankings);
                await updateLeaderboard(game); 
            }
        }
        // Check if player gets extra turn
        let shouldAdvanceTurn = true;
        
        // If rolled 6, grant extra turn
        if (game.extraTurn) {
            shouldAdvanceTurn = false;  // Don't advance - same player rolls again
            game.extraTurn = false;  // Reset flag (they used their extra turn opportunity)
            game.extraTurnReason = null;
        }
        
        // Auto-advance turn if no extra turn
        if (shouldAdvanceTurn) {
            const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
            
            // Skip players who already finished (have rank)
            let finalTurnIndex = nextTurnIndex;
            let skipped = 0;
            
            while (game.players[finalTurnIndex].rank !== null && skipped < game.players.length) {
                finalTurnIndex = (finalTurnIndex + 1) % game.players.length;
                skipped++;
            }
            
            // Update turn
            if (skipped < game.players.length - 1) {
                game.currentTurn = finalTurnIndex;
                console.log(`Turn auto-advanced to ${game.players[game.currentTurn].playerName}`);
            }
        }

        await game.save();

        res.status(200).json({
            success: true,
            message: 'Pawn moved successfully',
            data: {
                playerName,
                pawnId,
                newPosition: pawn.position,
                isHome: pawn.isHome,
                currentTurn: game.currentTurn,
                currentPlayer: game.players[game.currentTurn].playerName,
                turnAdvanced: shouldAdvanceTurn,
                extraTurnGranted: !shouldAdvanceTurn
            }
        });

    } catch (error) {
        console.error('Error moving pawn:', error);
        res.status(500).json({ error: 'Failed to move pawn' });
    }
};

module.exports = {
    movePawn
};
