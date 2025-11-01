const Game = require('../models/gameSchema.js');
const { v4: uuidv4 } = require('uuid');

const availableColors = ['red', 'blue', 'green', 'yellow'];

const createGame = async (req, res) => {
    try {
        const { mode, playerName } = req.body;

        if (!playerName) {
            return res.status(400).json({ error: "Player name is required" });
        }

        if (!mode || !['offline', 'online'].includes(mode)) {
            return res.status(400).json({ error: "Invalid or missing game mode" });
        }

        const gameId = uuidv4();

        const newGame = new Game({
            gameId: gameId,
            mode: mode,
            players: [{
                playerName: playerName,
                color: availableColors[0],
                pawns: [
                    {pawnId: 0, position: -1, isHome: false},
                    {pawnId: 1, position: -1, isHome: false},
                    {pawnId: 2, position: -1, isHome: false},
                    {pawnId: 3, position: -1, isHome: false}
                ]
            }],
            gameStatus: 'waiting',
            
        });

        await newGame.save();
        res.status(201).json({ message: "Game created successfully",
             data: {
                gameId: newGame.gameId,
                mode: newGame.mode,
                players: newGame.players,
                gameStatus: newGame.gameStatus,
             }});

    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ error: "Failed to create game" });
    }
};

const joinGame = async (req, res) =>{
    try{
        const { gameId, playerName } = req.body;

        if (!gameId ) {
            return res.status(400).json({ error: "Game ID is required" });
        }

        if (!playerName) {
            return res.status(400).json({ error: "Player name is required" });
        }
        const game = await Game.findOne({gameId: gameId});

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        if (game.players.length >=4){
            return res.status(400).json({error: "Game is full. Maximum 4 players allowed."});
        }

        if (game.gameStatus === 'active') {
            return res.status(400).json({ error: "Cannot join. Game already in progress." });
        }

        const existingPlayer = game.players.find(player => player.playerName === playerName);
        if (existingPlayer) {
            return res.status(400).json({ error: "Player name already taken in this game." });
        }

        const assignedColor = game.players.map(p => p.color);
        const availableColor = availableColors.find(color => !assignedColor.includes(color));

        game.players.push ({
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
        res.status(200).json({ message: "Joined game successfully",
         data: {
            gameId: game.gameId,
            mode: game.mode,
            players: game.players,
            gameStatus: game.gameStatus,
         }});
    } catch (error) {
    console.error("Error joining game:", error);
    res.status(500).json({ error: "Failed to join game" });
}
};

module.exports = {createGame, joinGame};  