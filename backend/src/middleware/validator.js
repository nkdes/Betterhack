const { check } = require('express-validator');

exports.validateHackathon = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Hackathon name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  check('startDate')
    .isISO8601()
    .withMessage('Invalid start date'),
  check('endDate')
    .isISO8601()
    .withMessage('Invalid end date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('maxParticipants')
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1'),
  check('maxTeamSize')
    .isInt({ min: 1 })
    .withMessage('Maximum team size must be at least 1')
];

exports.validateTeam = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  check('hackathonId')
    .isMongoId()
    .withMessage('Invalid hackathon ID')
];

exports.validateBet = [
  check('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Bet amount must be greater than 0'),
  check('teamId')
    .isMongoId()
    .withMessage('Invalid team ID'),
  check('hackathonId')
    .isMongoId()
    .withMessage('Invalid hackathon ID')
];

exports.registerValidation = [
  check('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores and dashes'),
  
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  
  check('walletAddress')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid wallet address format')
]; 