const Game = require('../models/gameSchema.js');

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
                    currentTurn: game.currentTurn
                });
            }catch (error) {
                console.error("Error in get-game-state:", error);
                socket.emit('error', {message: "Failed to get game state"});
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