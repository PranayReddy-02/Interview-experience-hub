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
  body('codingQuestions.*.topic').optional().isString(),
  body('codingQuestions.*.solved').optional().isBoolean(),
  body('numberOfCodingProblems').optional().isInt({ min: 0 }),
  body('systemDesignTopics').optional().isString().trim(),
  body('coreSkillsTopics').optional().isString().trim(),
  body('projectDiscussion').optional().isString().trim(),

  // Preparation Journey (New Fields - all optional)
  body('preparationDuration').optional().isString().trim(),
  body('studyMaterials').optional().isArray(),
  body('studyMaterials.*').optional().isString(),
  body('keyTopics').optional().isArray(),
  body('keyTopics.*').optional().isString(),
  body('practiceHours').optional().isNumeric(),
  body('mocksGiven').optional().isNumeric(),
  body('preparationTips').optional().isString().trim(),
  body('challenges').optional().isString().trim(),
  body('advice').optional().isString().trim(),
  body('problemsSolved').optional().isNumeric(),
  body('confidenceLevel').optional().isString().trim(),
  body('preparationApproach').optional().isString().trim(),
  body('timeManagement').optional().isString().trim(),
  body('resourcesHelpful').optional().isString().trim(),
  body('wouldChangeApproach').optional().isString().trim(),
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

const validateAdminExperienceEdit = [
  // Basic Info (optional for admin edits - only validate if provided)
  body('company').optional().trim().isLength({ min: 1 }).withMessage('Company cannot be empty if provided.'),
  body('role').optional().trim().isLength({ min: 1 }).withMessage('Role cannot be empty if provided.'),
  body('location').optional().trim().isLength({ min: 1 }).withMessage('Location cannot be empty if provided.'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level.'),
  body('gotOffer').optional().isBoolean().withMessage('Offer status must be a boolean.'),
  body('interviewMode').optional().isIn(['Remote', 'Onsite']),
  body('numberOfRounds').optional().isInt({ min: 1 }).withMessage('Number of rounds must be at least 1.'),

  // Personal Details (optional for admin edits - only validate if provided)
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty if provided.'),
  body('email').optional().isEmail().withMessage('A valid email is required if provided.'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('A valid 10-digit phone number is required if provided.'),
  body('linkedinProfile').optional().isURL().withMessage('LinkedIn profile must be a valid URL.'),
  body('degree').optional().isLength({ min: 1 }).withMessage('Degree cannot be empty if provided.'),
  body('branch').optional().isLength({ min: 1 }).withMessage('Branch cannot be empty if provided.'),
  body('college').optional().isLength({ min: 1 }).withMessage('College cannot be empty if provided.'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10.'),
  body('experience').optional().isIn(['Fresher', '0-3 Years', '3+ Years']).withMessage('Invalid experience level.'),

  // Technical Questions (optional)
  body('codingQuestions').optional().isArray(),
  body('codingQuestions.*.question').optional().isString(),
  body('codingQuestions.*.difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  body('codingQuestions.*.topic').optional().isString(),
  body('codingQuestions.*.solved').optional().isBoolean(),
  body('numberOfCodingProblems').optional().isInt({ min: 0 }),
  body('systemDesignTopics').optional().isString().trim(),
  body('coreSkillsTopics').optional().isString().trim(),
  body('projectDiscussion').optional().isString().trim(),

  // Preparation Journey (optional)
  body('preparationDuration').optional().isString().trim(),
  body('studyMaterials').optional().isArray(),
  body('studyMaterials.*').optional().isString(),
  body('keyTopics').optional().isArray(),
  body('keyTopics.*').optional().isString(),
  body('practiceHours').optional().isNumeric(),
  body('mocksGiven').optional().isNumeric(),
  body('preparationTips').optional().isString().trim(),
  body('challenges').optional().isString().trim(),
  body('advice').optional().isString().trim(),
  body('problemsSolved').optional().isNumeric(),
  body('confidenceLevel').optional().isString().trim(),
  body('preparationApproach').optional().isString().trim(),
  body('timeManagement').optional().isString().trim(),
  body('resourcesHelpful').optional().isString().trim(),
  body('wouldChangeApproach').optional().isString().trim(),

  // Admin specific fields
  body('upvotes').optional().isInt({ min: 0 }).withMessage('Upvotes must be a non-negative integer.'),
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
  validateAdminExperienceEdit,
  handleValidationErrors,
};
