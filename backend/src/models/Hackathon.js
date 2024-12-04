const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  prizePool: {
    type: Number,
    default: 0
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  maxTeamSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  totalBets: {
    type: Number,
    default: 0
  },
  winners: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    place: Number,
    prize: Number
  }]
}, {
  timestamps: true
});

// Add indexes for common queries
hackathonSchema.index({ status: 1, startDate: -1 });
hackathonSchema.index({ organizer: 1 });

module.exports = mongoose.model('Hackathon', hackathonSchema);