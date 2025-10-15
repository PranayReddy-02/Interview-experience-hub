const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateExperience,
  validateExperienceQuery,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   - name: Experiences
 *     description: Interview experience management
 *   - name: Companies
 *     description: Company-related statistics
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CodingQuestion:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *         topic:
 *           type: string
 *         solved:
 *           type: boolean
 *
 *     ExperienceInput:
 *       type: object
 *       required:
 *         - company
 *         - role
 *         - location
 *         - difficulty
 *         - gotOffer
 *         - name
 *         - email
 *         - phone
 *         - degree
 *         - branch
 *         - college
 *         - experience
 *       properties:
 *         company: { type: string, example: 'Google' }
 *         role: { type: string, example: 'Software Engineer' }
 *         location: { type: string, example: 'Mountain View, CA' }
 *         difficulty: { type: string, enum: [Easy, Medium, Hard], example: 'Medium' }
 *         gotOffer: { type: boolean, example: true }
 *         interviewMode: { type: string, enum: [Remote, Onsite], example: 'Remote' }
 *         numberOfRounds: { type: number, example: 4 }
 *         name: { type: string, example: 'Jane Doe' }
 *         email: { type: string, format: email, example: 'jane.doe@example.com' }
 *         phone: { type: string, example: '1234567890' }
 *         linkedinProfile: { type: string, format: url, example: 'https://linkedin.com/in/janedoe' }
 *         degree: { type: string, example: 'B.Tech' }
 *         branch: { type: string, example: 'Computer Science' }
 *         college: { type: string, example: 'MIT' }
 *         cgpa: { type: number, example: 9.0 }
 *         experience: { type: string, enum: [Fresher, '0-3 Years', '3+ Years'], example: 'Fresher' }
 *         codingQuestions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CodingQuestion'
 *         systemDesignTopics: { type: string }
 *         coreSkillsTopics: { type: string }
 *         projectDiscussion: { type: string }
 *         preparationDuration: { type: string, example: '2-3 months' }
 *         studyMaterials: { type: array, items: { type: string }, example: ['LeetCode', 'System Design Primer'] }
 *         keyTopics: { type: array, items: { type: string }, example: ['Arrays', 'Graphs'] }
 *         practiceHours: { type: number, example: 3 }
 *         mocksGiven: { type: number, example: 5 }
 *         preparationTips: { type: string, example: 'Focus on consistency.' }
 *         challenges: { type: string, example: 'Time management was tough.' }
 *         advice: { type: string, example: 'Practice mock interviews with peers.' }
 *         problemsSolved: { type: number, example: 250 }
 *         confidenceLevel: { type: string, example: 'Confident' }
 *         preparationApproach: { type: string, example: 'Online courses + practice' }
 *         timeManagement: { type: string, example: 'Used a structured schedule.' }
 *         resourcesHelpful: { type: string, example: 'Grokking the System Design Interview course.' }
 *         wouldChangeApproach: { type: string, example: 'Start with mock interviews earlier.' }
 *
 */

/**
 * @swagger
 * /api/experiences:
 *   get:
 *     summary: Get all interview experiences
 *     description: Retrieve a paginated list of interview experiences with optional filtering and sorting
 *     tags: [Experiences]
 *     parameters:
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company name (case insensitive)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role (case insensitive)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (case insensitive)
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *           default: latest
 *         description: Sort experiences by latest or popular (upvotes)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of experiences per page
 *     responses:
 *       200:
 *         description: Successfully retrieved experiences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedExperiences'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', validateExperienceQuery, handleValidationErrors, asyncHandler(async (req, res) => {
  const {
    company,
    role,
    location,
    difficulty,
    sortBy = 'latest',
    page = 1,
    limit = 10
  } = req.query;

  // Build filter object
  const filter = {};
  if (company) filter.company = new RegExp(company, 'i');
  if (role) filter.role = new RegExp(role, 'i');
  if (location) filter.location = new RegExp(location, 'i');
  if (difficulty) filter.difficulty = difficulty;

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'popular':
      sort = { upvotes: -1, createdAt: -1 };
      break;
    case 'latest':
    default:
      sort = { createdAt: -1 };
      break;
  }

  const experiences = await Experience.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-email -phone -linkedinProfile') // Hide sensitive data
    .exec();

  const total = await Experience.countDocuments(filter);

  res.json({
    experiences,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    total
  });
}));

/**
 * @swagger
 * /api/experiences/{id}:
 *   get:
 *     summary: Get a specific interview experience
 *     description: Retrieve a single interview experience by ID
 *     tags: [Experiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The experience ID
 *     responses:
 *       200:
 *         description: Successfully retrieved experience
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       404:
 *         description: Experience not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid experience ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateObjectId, handleValidationErrors, asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id)
    .select('-email -phone -linkedinProfile'); // Hide sensitive data

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  res.json(experience);
}));

/**
 * @swagger
 * /api/experiences:
 *   post:
 *     summary: Create a new interview experience
 *     description: Submit a new interview experience to the platform
 *     tags: [Experiences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExperienceInput'
 *     responses:
 *       201:
 *         description: Experience created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Experience'
 *       400:
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateExperience, handleValidationErrors, asyncHandler(async (req, res) => {
  // Auto-generate tags based on experience level
  const tags = [];
  if (req.body.experience === 'Fresher') {
    tags.push('Fresher');
  } else if (req.body.experience === '0-3 Years') {
    tags.push('Experienced');
  } else {
    tags.push('Senior');
  }

  // Add role-based tags
  if (req.body.role.toLowerCase().includes('intern')) {
    tags.push('Internship');
  }

  const experience = new Experience({
    ...req.body,
    tags
  });

  const savedExperience = await experience.save();
  res.status(201).json(savedExperience);
}));

/**
 * @swagger
 * /api/experiences/{id}/upvote:
 *   put:
 *     summary: Upvote an interview experience
 *     description: Increment the upvote count for a specific experience
 *     tags: [Experiences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The experience ID
 *     responses:
 *       200:
 *         description: Successfully upvoted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upvotes:
 *                   type: number
 *                   description: Updated upvote count
 *       404:
 *         description: Experience not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid experience ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/upvote', validateObjectId, handleValidationErrors, asyncHandler(async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  res.json({ upvotes: experience.upvotes });
}));

/**
 * @swagger
 * /api/experiences/companies/popular:
 *   get:
 *     summary: Get popular companies
 *     description: Retrieve a list of companies sorted by number of experiences and average upvotes
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Successfully retrieved popular companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Company name
 *                   count:
 *                     type: number
 *                     description: Number of experiences for this company
 *                   avgUpvotes:
 *                     type: number
 *                     description: Average upvotes for this company
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/companies/popular', asyncHandler(async (req, res) => {
  const popularCompanies = await Experience.aggregate([
    {
      $group: {
        _id: '$company',
        count: { $sum: 1 },
        avgUpvotes: { $avg: '$upvotes' }
      }
    },
    {
      $sort: { count: -1, avgUpvotes: -1 }
    },
    {
      $limit: 20
    }
  ]);

  res.json(popularCompanies);
}));

module.exports = router;