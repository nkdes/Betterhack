const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const teamRoutes = require('./routes/teamRoutes');
const betRoutes = require('./routes/betRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;