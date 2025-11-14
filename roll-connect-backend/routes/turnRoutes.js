const express = require('express');
const router = express.Router();
const {nextTurn} = require('../controllers/turnController');

router.post('/next', nextTurn);

module.exports = router;