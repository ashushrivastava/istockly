// backend/routes/admin.js
// Admin-only routes for course and user management

const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const UserProgress = require('../models/UserProgress');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// All admin routes require authentication and admin privileges
router.use(requireAuth);
router.use(requireAdmin);

// Create new course
router.post('/courses', async (req, res) => {
  try {
    const courseData = req.body;
    
    // Generate slug if not provided
    if (!courseData.slug) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const course = new Course(courseData);
    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course with this slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Get all courses (including unpublished)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .sort('-createdAt')
      .select('-enrolledUsers.userId'); // Hide user IDs
    
    res.json(courses);
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course with full details
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get admin course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Also delete associated data
    await UserProgress.deleteMany({ courseId: req.params.id });
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Toggle course publish status
router.patch('/courses/:id/publish', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    course.isPublished = !course.isPublished;
    await course.save();
    
    res.json(course);
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    // Total courses
    const totalCourses = await Course.countDocuments();
    
    // Total enrollments
    const enrollmentAgg = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEnrollments' } } }
    ]);
    const totalEnrollments = enrollmentAgg[0]?.total || 0;
    
    // Total revenue from successful payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    
    // Get total users from Clerk
    let totalUsers = 0;
    try {
      const usersList = await clerkClient.users.getUserList({ limit: 1 });
      totalUsers = usersList.totalCount || 0;
    } catch (clerkError) {
      console.error('Clerk API error:', clerkError);
    }
    
    // Recent transactions
    const recentTransactions = await Payment.find()
      .populate('courseId', 'title thumbnail price')
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Top courses by enrollments
    const topCourses = await Course.find()
      .sort({ totalEnrollments: -1 })
      .limit(5)
      .select('title totalEnrollments thumbnail price');
    
    // Revenue by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          status: 'SUCCESS',
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalUsers,
      totalRevenue,
      totalCourses,
      totalEnrollments,
      recentTransactions,
      topCourses,
      revenueByMonth
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all users (from Clerk)
router.get('/users', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const users = await clerkClient.users.getUserList({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
// Get all users from DB
router.get('/users/db', async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new course
router.post('/courses', async (req, res) => {
  try {
    console.log('Received course data:', JSON.stringify(req.body, null, 2));
    
    const courseData = req.body;
    
    // Generate slug if not provided
    if (!courseData.slug) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Validate required fields
    if (!courseData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!courseData.price) {
      return res.status(400).json({ error: 'Price is required' });
    }
    if (!courseData.instructor) {
      return res.status(400).json({ error: 'Instructor is required' });
    }
    if (!courseData.description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const course = new Course(courseData);
    await course.save();
    
    console.log('Course created successfully:', course._id);
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    
    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: `A course with this ${field} already exists`,
        details: error.message 
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: messages 
      });
    }
    
    res.status(400).json({ 
      error: error.message,
      details: error.toString()
    });
  }
});
// Get user details with enrollments
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.params.userId);
    
    // Get user's enrolled courses
    const enrolledCourses = await Course.find({
      'enrolledUsers.userId': req.params.userId
    }).select('title slug thumbnail price enrolledUsers.$');
    
    // Get user's payments
    const payments = await Payment.find({ userId: req.params.userId })
      .populate('courseId', 'title')
      .sort('-createdAt');
    
    res.json({
      user,
      enrolledCourses,
      payments
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;