
const Game = require('../models/gameSchema.js');
const Leaderboard = require('../models/leaderboardSchema.js');
const {updateLeaderboard} = require('../utils/leaderboardHelper');

const availableColors = ['red', 'blue', 'green', 'yellow']; 

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("Player connected:", socket.id);

        // player joins a game room
        socket.on('join-game', async (data) => {
            try {
                const {gameId, playerName} = data;

                console.log(`Player ${playerName} is trying to join game ${gameId}`);

                // find a game 
                
                const game = await Game.findOne({gameId: gameId});
                if (!game) {
                    socket.emit('error', {message: "Game not found"});
                    return;
                }

                // if (game.players.length >= 4) {
                //     socket.emit('error', {message: "Game is full"});
                //     return;
                // }

                if (game.gameStatus === 'active') {
                    socket.emit('error', {message: "Game already in progress"});
                    return;
                }

                const existingPlayer = game.players.find(p => p.playerName === playerName);
                
                if (!existingPlayer && game.players.length >= 4) {
                    socket.emit('error', { message: 'Game is full' });
                    return;  
                }

                if (!existingPlayer) {
                    const usedColors = game.players.map(p => p.color);
                    const availableColor = availableColors.find(color => !usedColors.includes(color));

                    game.players.push({
                        playerName: playerName,
                        color: availableColor,
                        pawns: [
                            {pawnId: 0, position: -1, isHome: false},
                            {pawnId: 1, position: -1, isHome: false},
                            {pawnId: 2, position: -1, isHome: false},
                            {pawnId: 3, position: -1, isHome: false}
                        ]
                    }); 

                    await game.save();
                }   

                socket.join(gameId);
                socket.gameId = gameId;
                socket.playerName = playerName; 

                io.to(gameId).emit('player-joined', {
                    gameId: game.gameId,
                    mode: game.mode,
                    players: game.players,
                    newPlayer: playerName,
                    gameStatus: game.gameStatus
                });
                
                console.log(`Player ${playerName} joined game ${gameId}`);

            } catch (error) {
                console.error("Error in join-game:", error);
                socket.emit('error', {message: "Failed to join game"});
            }   
        });

        // start game  

        socket.on('start-game', async (data) => {
            try {
                const {gameId} = data;

                const game = await Game.findOne({gameId});

                if (!game) {
                    socket.emit('error', {message: "Game not found"});
                    return;
                }   

                if (game.players.length < 2) {
                    socket.emit('error', {message: "Need atleast 2 players to start the game"});
                    return;
                }
                game.gameStatus = 'active';
                game.currentTurn= 0;
                game.startTime = new Date();
                await game.save();

                // notify all players in the game room that the game has started
                io.to(gameId).emit('game-started', {
                    mode: game.mode,
                    gameStatus: game.gameStatus,
                    currentTurn: game.currentTurn,
                    players: game.players,
                    message: "Game has started!"    
                });
                console.log(`Game ${gameId} has started`);
            } catch (error) {
                console.error("Error in start-game:", error);
                socket.emit('error', {message: "Failed to start game"});
            }


        }); 
        
        socket.on('leave-game', async(data) => {
            try {
                const {gameId, playerName} = data;

                const game = await Game.findOne({gameId});
                if (!game) return; 

                const wasInGame = game.players.some(p => p.playerName === playerName);
                if (!wasInGame) return;

                // remove player from game
                game.players = game.players.filter(p => p.playerName !== playerName);
                if (game.players.length === 0) {
                    // delete game if no players left
                    await Game.deleteOne({gameId});
                } else {
                    await game.save();
                } 
                
                socket.leave(gameId);

                //notify other players

                io.to(gameId).emit('player-left', {
                    players: game.players,
                    leftPlayer: playerName  
                });

                console.log(`Player ${playerName} left game ${gameId}`);

            } catch (error) {
                console.error("Socket leave-game error:", error);
            }
        });

        // get current game state
        socket.on('get-game-state', async (data) => {
            try {
                const {gameId} = data;
                const game = await Game.findOne({gameId});
                if (!game) {
                    socket.emit('error', {message: "Game not found"});
                    return;
                }
                socket.emit('game-state', {
                    gameId: game.gameId,
                    players: game.players,
                    mode: game.mode,
                    gameStatus: game.gameStatus,
                    currentTurn: game.currentTurn,
                    diceValue: game.diceValue
                });
            }catch (error) {
                console.error("Error in get-game-state:", error);
                socket.emit('error', {message: "Failed to get game state"});
            }
        });

        socket.on('roll-dice', async (data) => {
            try{
                const {gameId, playerName} = data;

                const game = await Game.findOne({gameId: gameId});

                if (!game) {
                    socket.emit('error', { message: 'Game not found' });
                    return;
                }
                // check if game is active
                if (game.gameStatus !== 'active') {
                    socket.emit('error', { message: 'Game is not active. Cannot roll dice.' });
                    return;
                }
                // check if it's the player's turn
                const currentPlayer = game.players[game.currentTurn];
                if (!currentPlayer) {
                    socket.emit('error', { message: 'Invalid turn state' });
                    return;
                }
                // ✅ Handle whitespace in player names
                if (currentPlayer.playerName.trim() !== playerName.trim()) {
                    socket.emit('error', { message: `Not your turn! It's ${currentPlayer.playerName}'s to roll the dice.` });
                    return;
                }
                // roll the dice
                const diceValue = Math.floor(Math.random() * 6) + 1;
                // update the game with the new dice value
                game.diceValue = diceValue;
                game.waitingForPawnMove = true;
                game.lastRoll = {  
                    playerName: playerName,
                    timestamp: new Date()
                };  
                await game.save();

                //notify all players in the game room about the dice roll
                io.to(gameId).emit('dice-rolled', {
                    message: `${playerName} rolled a ${diceValue}`,
                    diceValue: diceValue,
                    playerName: playerName,
                    currentTurn: game.currentTurn
                });
                console.log(`Player ${playerName} rolled a ${diceValue} in game ${gameId}`);    

            }catch (error) {
                console.error("Error in roll-dice:", error);
                socket.emit('error', {message: "Failed to roll dice"});
            }
        });
        
        socket.on('next-turn', async (data) => {
            try {
                const {gameId} = data; 
                const game = await Game.findOne({gameId});

                if (!game) {
                    socket.emit('error', {message: "Game not found"});
                    return; 
                }

                // check for extra turn
                if (game.extraTurn) {
                    game.extraTurn = false;
                    game.extraTurnReason = null;
                    game.waitingForPawnMove = false;
                    game.diceValue = null;
                    await game.save();

                    io.to(gameId).emit('extra-turn-granted', {
                        currentPlayer: game.players[game.currentTurn].playerName,
                        message: 'Roll again! Extra turn granted'
                    });
                    return; 
                }
                // move to next turn
                const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
                game.currentTurn = nextTurnIndex;
                game.consecutiveSixes = 0;
                game.extraTurn = false;
                game.waitingForPawnMove = false;
                game.diceValue = null;
                await game.save();

                io.to(gameId).emit('turn-changed', {
                    currentTurn: game.currentTurn,
                    currentPlayer: game.players[nextTurnIndex].playerName,
                    message: `${game.players[nextTurnIndex].playerName}'s turn`
                });
                console.log(`Turn moved to ${game.players[nextTurnIndex].playerName}`);
            } catch (error) {
                console.error("socket next-turn error:", error);
                socket.emit('error', {message: "Failed to move turn"});
            }
        });

        socket.on('move-pawn', async (data) => {
        try {
            const { gameId, playerName, pawnId } = data;

            const game = await Game.findOne({ gameId });
            if (!game) {
                socket.emit('error', { message: 'Game not found' });
                return;
            }

            // ✅ Handle whitespace in player names
            const playerIndex = game.players.findIndex(p => p.playerName.trim() === playerName.trim());
            if (playerIndex === -1) {
                socket.emit('error', { message: 'Player not found' });
                return;
            }

            const player = game.players[playerIndex];
            const pawn = player.pawns.find(p => p.pawnId === Number(pawnId));
            
            if (!pawn) {
                socket.emit('error', { message: 'Pawn not found' });
                return;
            }

            if (game.currentTurn !== playerIndex) {
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            if (!game.diceValue) {
                socket.emit('error', { message: 'Roll dice first' });
                return;
            }

            const diceValue = game.diceValue;

            // Pawn movement logic
            // safe spots
            const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];

            if (pawn.position === -1) {
                if (diceValue !== 6) {
                    socket.emit('error', { message: 'Need 6 to start' });
                    return;
                }
                pawn.position = 0;
            } else {
                let newPosition = pawn.position + diceValue;
                if (newPosition >=57){
                    pawn.position = 57;
                    pawn.isHome = true;
                    game.extraTurn = true;
                game.extraTurnReason = 'pawn_finished';
                
                console.log(`${playerName}'s pawn reached home! Extra turn granted.`);
                } else {
                    pawn.position = newPosition;

                    if (!SAFE_SPOTS.includes(newPosition)) {
                        let captured = false;

                        // check all players' pawns
                        game.players.forEach((otherPlayer, otherIndex) => {
                            // skip current player
                            if (otherIndex === playerIndex) return; 

                            // check each pawn of other players
                            otherPlayer.pawns.forEach(otherPawn => {
                                if (otherPawn.position === newPosition && otherPawn.position !== -1) {
                                    // capture the pawn
                                    otherPawn.position = -1;
                                    otherPawn.isHome = false;
                                    captured = true;

                                    // broadcast capture event
                                    io.to(gameId).emit('pawn-captured', {
                                        capturedBy: playerName,
                                        capturedPlayer: otherPlayer.playerName,
                                        capturedPawnId: otherPawn.pawnId,
                                        position: newPosition,
                                        message: `${playerName} captured ${otherPlayer.playerName}'s pawn!`

                                    });
                                    console.log(`${playerName} captured ${otherPlayer.playerName}'s pawn at position ${newPosition}`);
                                }
                            });
                        });

                        // grant extra turn if captured
                        if (captured) {
                            game.extraTurn = true;
                            game.extraTurnReason = 'captured a pawn';
                        }
                    }
                }
            }

            game.diceValue = null;
            game.waitingForPawnMove = false;

            // check if the player finished all pawns
            const allPawnsHome = player.pawns.every( p => p.isHome === true);

            if (allPawnsHome && player.rank === null) {
                // assign ranks
                const finishedPlayers = game.players.filter( p => p.rank !== null);
                player.rank = finishedPlayers.length + 1;
                player.finishedAt = new Date();

                // notify other players 
                io.to(gameId).emit('player-finished', {
                    playerName: playerName,
                    rank: player.rank,
                    color: player.color,
                    message: `${playerName} finished in Rank ${player.rank}!`
                });
                console.log(`${playerName} finished with Rank ${player.rank}`);

                // check if the game should end
                const playerWithoutRank = game.players.filter(p => p.rank === null);

                if (playerWithoutRank.length === 1) {
                    const lastPlayer = playerWithoutRank[0];
                    lastPlayer.rank = game.players.length;
                    lastPlayer.finishedAt = new Date(); 

                    game.gameStatus = 'completed';
                    game.endTime = new Date();

                    const rankings = game.players
                    .sort((a,b) => a.rank - b.rank)
                    .map( p => ({ 
                        playerName: p.playerName,
                        color: p.color,
                        rank: p.rank
                    }));

                    // broadcast game over with full rankings 
                    io.to(gameId).emit('game-over', {
                        message:"Game Over! Final Rankings:",
                        rankings: rankings,
                        winner: rankings[0].playerName
                    });
                    await updateLeaderboard(game);

                    console.log("Game completed! Rankings:", rankings);
                }
            }
            
            // ✅ CRITICAL: Broadcast pawn moved FIRST
            io.to(gameId).emit('pawn-moved', {
                playerName: playerName,
                pawnId: pawnId,
                newPosition: pawn.position,
                isHome: pawn.isHome,
                color: player.color,
                message: `${playerName} moved pawn ${pawnId} to position ${pawn.position}`
            });
            console.log(`✅ Pawn moved: ${playerName} - Pawn ${pawnId} to ${pawn.position}`);
            
            // ✅ CRITICAL: Auto-advance turn if no extra turn
            let shouldAdvanceTurn = true;
            if (game.extraTurn) {
                shouldAdvanceTurn = false;
                game.extraTurn = false;
                game.extraTurnReason = null;
                
                await game.save();
                
                // Notify about extra turn
                io.to(gameId).emit('extra-turn-granted', {
                    currentPlayer: game.players[game.currentTurn].playerName,
                    message: 'Extra turn granted!'
                });
                console.log(`✅ Extra turn granted to ${game.players[game.currentTurn].playerName}`);
            }
            
            // Auto-advance turn if no extra turn
            if (shouldAdvanceTurn) {
                const nextTurnIndex = (game.currentTurn + 1) % game.players.length;
                
                // Skip players who already finished
                let finalTurnIndex = nextTurnIndex;
                let skipped = 0;
                while (game.players[finalTurnIndex] && game.players[finalTurnIndex].rank !== null && skipped < game.players.length) {
                    finalTurnIndex = (finalTurnIndex + 1) % game.players.length;
                    skipped++;
                }
                
                if (skipped < game.players.length) {
                    game.currentTurn = finalTurnIndex;
                    game.consecutiveSixes = 0;
                    
                    await game.save();
                    
                    // ✅ CRITICAL: Notify turn changed AFTER saving
                    io.to(gameId).emit('turn-changed', {
                        currentTurn: game.currentTurn,
                        currentPlayer: game.players[finalTurnIndex].playerName,
                        message: `${game.players[finalTurnIndex].playerName}'s turn`
                    });
                    console.log(`✅ Turn auto-advanced to ${game.players[finalTurnIndex].playerName} (index: ${finalTurnIndex})`);
                } else {
                    await game.save();
                }
            }

        } catch (error) {
            console.error('Socket move-pawn error:', error);
            socket.emit('error', { message: 'Failed to move pawn' });
        }
    });

        //handle disconnect 
        socket.on('disconnect', () => {
            console.log("Player disconnected:", socket.id);

            if (socket.gameId && socket.playerName) {
                io.to(socket.gameId).emit('player-disconnected', {
                    playerName: socket.playerName,
                    message: `${socket.playerName} has disconnected`
                });
            }
        });


    });

    
};
