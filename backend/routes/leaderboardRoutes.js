const express = require('express');
const router = express.Router();
const { getLeaderboard, addPlayer } = require('../controllers/leaderboardController.js');

router.get('/', getLeaderboard);
router.post('/', addPlayer);

module.exports = router;