const express = require('express');
const router = express.Router();
const { movePawn } = require('../controllers/pawnController');

router.post('/move', movePawn);

module.exports = router;