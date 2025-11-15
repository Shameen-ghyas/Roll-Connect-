const Leaderboard = require('../models/leaderboardSchema');

async function updateLeaderboard(game) {
    try {
        const scoreMap = { 1: 100, 2: 75, 3: 50, 4: 25 };
        
        for (const player of game.players) {
            const earnedScore = scoreMap[player.rank] || 0;
            
            let leaderboardEntry = await Leaderboard.findOne({ 
                playerName: player.playerName 
            });
            
            if (leaderboardEntry) {
                leaderboardEntry.score += earnedScore;
                if (player.rank === 1) {
                    leaderboardEntry.wins = (leaderboardEntry.wins || 0) + 1;
                }
                await leaderboardEntry.save();
                console.log(`${player.playerName} +${earnedScore} points`);
            } else {
                leaderboardEntry = new Leaderboard({
                    playerName: player.playerName,
                    score: earnedScore,
                    wins: player.rank === 1 ? 1 : 0
                });
                await leaderboardEntry.save();
                console.log(`${player.playerName} created with ${earnedScore} points`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { updateLeaderboard };