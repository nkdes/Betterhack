const express = require('express');
const { protect } = require('../middleware/auth');
const { validateBet } = require('../middleware/validator');
const { placeBet } = require('../controllers/betController');

const router = express.Router();

router.route('/')
  .post(protect, validateBet, placeBet);

module.exports = router; 