const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validateHackathon } = require('../middleware/validator');
const {
  createHackathon,
  getHackathons,
  getHackathon,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');

const router = express.Router();

router.route('/')
  .get(getHackathons)
  .post(protect, authorize('organizer', 'admin'), validateHackathon, createHackathon);

router.route('/:id')
  .get(getHackathon)
  .put(protect, authorize('organizer', 'admin'), validateHackathon, updateHackathon)
  .delete(protect, authorize('organizer', 'admin'), deleteHackathon);

module.exports = router; 