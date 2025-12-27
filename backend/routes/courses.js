// backend/routes/courses.js
// Public course routes

const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all published courses with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, level, search, sort = '-createdAt' } = req.query;
    let query = { isPublished: true };

    // Apply filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .select('-enrolledUsers -reviews') // Exclude sensitive data
      .sort(sort);
    
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course by slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ 
      slug: req.params.slug, 
      isPublished: true 
    }).select('-enrolledUsers'); // Don't expose enrolled users publicly

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get courses by category
router.get('/category/:category', async (req, res) => {
  try {
    const courses = await Course.find({ 
      category: req.params.category,
      isPublished: true 
    })
    .select('-enrolledUsers -reviews')
    .sort('-createdAt');

    res.json(courses);
  } catch (error) {
    console.error('Get category courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get all unique categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    res.json(categories.filter(Boolean)); // Remove null/undefined
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;