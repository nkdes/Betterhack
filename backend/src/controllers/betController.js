const Bet = require('../models/Bet');
const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const ProfitCalculator = require('../utils/profitCalculator');

exports.placeBet = async (req, res) => {
  try {
    const { hackathonId, teamId, amount } = req.body;
    const userId = req.user.id;

    // Validate hackathon and betting status
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon || hackathon.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Betting is not available for this hackathon'
      });
    }

    // Validate team
    const team = await Team.findById(teamId);
    if (!team || !hackathon.teams.includes(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team selection'
      });
    }

    // Create and save bet
    const bet = await Bet.create({
      user: userId,
      hackathon: hackathonId,
      team: teamId,
      amount,
      status: 'active'
    });

    // Update hackathon total bets
    hackathon.totalBets += amount;
    await hackathon.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: {
        id: bet._id,
        amount,
        team: team.name,
        timestamp: bet.createdAt
      }
    });

  } catch (error) {
    console.error('Bet placement error:', error);
    res.status(500).json({ message: 'Error placing bet' });
  }
};