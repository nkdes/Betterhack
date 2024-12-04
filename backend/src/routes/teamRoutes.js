const express = require('express');
const { protect } = require('../middleware/auth');
const { validateTeam } = require('../middleware/validator');
const {
  createTeam,
  joinTeam,
  leaveTeam,
  getTeam
} = require('../controllers/teamController');

const router = express.Router();

router.route('/')
  .post(protect, validateTeam, createTeam);

router.route('/:teamId')
  .get(getTeam)
  .post(protect, joinTeam)
  .delete(protect, leaveTeam);

module.exports = router; 