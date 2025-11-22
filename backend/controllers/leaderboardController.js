const Leaderboard = require('../models/leaderboardSchema.js');

const getLeaderboard = async (req, res) => {
    try {
        const data = await Leaderboard.find().sort({ score: -1 }).limit(10);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "failed to fetch leaderboard data"});
    }
};
const addPlayer = async (req, res) => {
  try {
    const { playerName, score, wins } = req.body;

    // check if the player already exists
    const existing = await Leaderboard.findOne({ playerName });

    if (existing) {
      // always update with the latest values
      existing.score = score;
      existing.wins = wins;
      await existing.save();
      return res.json(existing);
    }

    // if not found, create new player entry
    const newPlayer = new Leaderboard({ playerName, score, wins });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: "failed to add player to leaderboard" });
  }
};
module.exports = {
    getLeaderboard,
    addPlayer
};