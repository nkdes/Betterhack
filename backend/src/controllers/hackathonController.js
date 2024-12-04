const Hackathon = require('../models/Hackathon');
const Team = require('../models/Team');
const { validationResult } = require('express-validator');

exports.createHackathon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hackathon = new Hackathon({
      ...req.body,
      organizer: req.user.id
    });

    await hackathon.save();

    res.status(201).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error('Create hackathon error:', error);
    res.status(500).json({ message: 'Error creating hackathon' });
  }
};

exports.getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('organizer', 'username email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: hackathons.length,
      data: hackathons
    });
  } catch (error) {
    console.error('Get hackathons error:', error);
    res.status(500).json({ message: 'Error fetching hackathons' });
  }
};

exports.getHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'username email')
      .populate({
        path: 'teams',
        populate: {
          path: 'members',
          select: 'username email profilePicture'
        }
      });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error('Get hackathon error:', error);
    res.status(500).json({ message: 'Error fetching hackathon' });
  }
};

exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is organizer
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this hackathon' });
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedHackathon
    });
  } catch (error) {
    console.error('Update hackathon error:', error);
    res.status(500).json({ message: 'Error updating hackathon' });
  }
};

exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is organizer
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    await hackathon.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete hackathon error:', error);
    res.status(500).json({ message: 'Error deleting hackathon' });
  }
}; 