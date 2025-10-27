const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Experience = require('../models/Experience');
const { generateToken, authenticateToken, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Valid phone number required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, phone, linkedinProfile, degree, branch, college, experience } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password, // In production, hash this password
    role: role || 'user', // Default to 'user' if not specified
    phone,
    linkedinProfile,
    degree,
    branch,
    college,
    experience
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user || user.password !== password) { // In production, use bcrypt.compare
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: 'Account is deactivated' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const { name, phone, linkedinProfile, degree, branch, college, experience } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (linkedinProfile) user.linkedinProfile = linkedinProfile;
  if (degree) user.degree = degree;
  if (branch) user.branch = branch;
  if (college) user.college = college;
  if (experience) user.experience = experience;

  await user.save();
  res.json({ message: 'Profile updated successfully', user });
}));

// @route   GET /api/users/experiences
// @desc    Get user's submitted experiences
// @access  Private
router.get('/experiences', authenticateToken, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const experiences = await Experience.find({
    userId: req.user._id,
    isActive: true
  })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Experience.countDocuments({
    userId: req.user._id,
    isActive: true
  });

  res.json({
    experiences,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// @route   GET /api/users/dashboard
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalExperiences = await Experience.countDocuments({ userId, isActive: true });
  const totalUpvotes = await Experience.aggregate([
    { $match: { userId: userId, isActive: true } },
    { $group: { _id: null, total: { $sum: '$upvotes' } } }
  ]);

  const recentExperiences = await Experience.find({ userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('company role createdAt upvotes');

  res.json({
    stats: {
      totalExperiences,
      totalUpvotes: totalUpvotes[0]?.total || 0,
      recentExperiences
    }
  });
}));

// @route   GET /api/users/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin only
router.get('/admin/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalExperiences = await Experience.countDocuments({ isActive: true });
  const recentUsers = await User.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email createdAt');

  const experiencesByCompany = await Experience.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    stats: {
      totalUsers,
      totalExperiences,
      recentUsers,
      experiencesByCompany
    }
  });
}));

// @route   GET /api/users/admin/users
// @desc    Get all users (admin only)
// @access  Admin only
router.get('/admin/users', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const users = await User.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments({ isActive: true });

  res.json({
    users,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

module.exports = router;
