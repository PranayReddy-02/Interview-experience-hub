const { body, query, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateExperience = [
  // Basic Info
  body('company').trim().notEmpty().withMessage('Company is required.'),
  body('role').trim().notEmpty().withMessage('Role is required.'),
  body('location').trim().notEmpty().withMessage('Location is required.'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level.'),
  body('gotOffer').isBoolean().withMessage('Offer status must be a boolean.'),
  body('interviewMode').optional().isIn(['Remote', 'Onsite']),
  body('numberOfRounds').optional().isInt({ min: 1 }).withMessage('Number of rounds must be at least 1.'),

  // Personal Details
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('A valid 10-digit phone number is required.'),
  body('linkedinProfile').optional().isURL().withMessage('LinkedIn profile must be a valid URL.'),
  body('degree').notEmpty().withMessage('Degree is required.'),
  body('branch').notEmpty().withMessage('Branch is required.'),
  body('college').notEmpty().withMessage('College is required.'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10.'),
  body('experience').isIn(['Fresher', '0-3 Years', '3+ Years']).withMessage('Invalid experience level.'),

  // Technical Questions
  body('codingQuestions').optional().isArray(),
  body('codingQuestions.*.question').optional().isString(),
  body('codingQuestions.*.difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),

  // Preparation Journey (New Fields - all optional)
  body('preparationDuration').optional().isString(),
  body('studyMaterials').optional().isArray(),
  body('keyTopics').optional().isArray(),
  body('practiceHours').optional().isInt({ min: 0 }),
  body('mocksGiven').optional().isInt({ min: 0 }),
  body('preparationTips').optional().isString(),
  body('challenges').optional().isString(),
  body('advice').optional().isString(),
  body('problemsSolved').optional().isInt({ min: 0 }),
  body('confidenceLevel').optional().isString(),
  body('preparationApproach').optional().isString(),
  body('timeManagement').optional().isString(),
  body('resourcesHelpful').optional().isString(),
  body('wouldChangeApproach').optional().isString(),
];

const validateExperienceQuery = [
  query('company').optional().isString(),
  query('role').optional().isString(),
  query('location').optional().isString(),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  query('sortBy').optional().isIn(['latest', 'popular']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const validateObjectId = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateExperience,
  validateExperienceQuery,
  validateObjectId,
  handleValidationErrors,
};