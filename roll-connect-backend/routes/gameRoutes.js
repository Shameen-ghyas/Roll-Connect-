const express = require('express');
const router = express.Router();
const { createGame, joinGame , startGame} = require('../controllers/gameController.js'); 

router.post('/create', createGame);
router.post('/join', joinGame);
router.post('/start', startGame);

module.exports = router;