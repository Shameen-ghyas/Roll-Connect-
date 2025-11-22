
const express = require('express');
const router = express.Router();
const { createGame, joinGame , startGame, getGameDetails} = require('../controllers/gameController.js'); 

router.post('/create', createGame);
router.post('/join', joinGame);
router.post('/start', startGame);
// router.post('/:gameId',getGameDetails);
router.get('/:gameId', getGameDetails);

module.exports = router;