const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all reviews for an experience
router.get('/:experienceId', async (req, res) => {
  try {
    const reviews = await Review.find({ experienceId: req.params.experienceId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add a review
router.post('/:experienceId',
  [
    authenticateToken,
    check('content', 'Review content is required').not().isEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newReview = new Review({
        experienceId: req.params.experienceId,
        userId: req.user.id,
        content: req.body.content,
        rating: parseInt(req.body.rating)
      });

      const review = await newReview.save();
      await review.populate('userId', 'name');

      res.json(review);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Update a review
router.put('/:id',
  [
    authenticateToken,
    check('content', 'Review content is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      // Check user ownership or admin role
      if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      review.content = req.body.content;
      if (req.body.rating !== undefined) {
        review.rating = parseInt(req.body.rating);
      }

      await review.save();
      await review.populate('userId', 'name');

      res.json(review);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check user ownership or admin role
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Admin edit review
router.put('/:id/admin-edit',
  [
    authenticateToken,
    requireAdmin,
    check('content', 'Review content is required').not().isEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      // Admin can edit any review
      review.content = req.body.content;
      review.rating = parseInt(req.body.rating);

      await review.save();
      await review.populate('userId', 'name');

      res.json(review);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Admin delete review (permanent deletion)
router.delete('/:id/admin-delete', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Admin can delete any review
    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Review permanently deleted by admin' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Like/Unlike a review
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check if already liked
    if (review.likes.includes(req.user.id)) {
      // Unlike
      review.likes = review.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      review.likes.unshift(req.user.id);
    }

    await review.save();
    res.json(review.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
