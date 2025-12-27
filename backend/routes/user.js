// backend/routes/user.js
// User-specific routes for enrolled courses and progress tracking

const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Get user's enrolled courses
router.get('/enrolled-courses', async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledUsers.userId': req.userId
    });

    const enrolledCourses = courses.map(course => {
      const enrollment = course.enrolledUsers.find(e => e.userId === req.userId);
      return {
        course: {
          _id: course._id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          instructor: course.instructor,
          thumbnail: course.thumbnail,
          duration: course.duration,
          level: course.level,
          category: course.category,
          curriculum: course.curriculum,
          rating: course.rating
        },
        enrollmentId: enrollment._id,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt
      };
    });

    res.json(enrolledCourses);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// Check if user has access to a course
router.get('/courses/:courseId/access', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const hasAccess = course.enrolledUsers.some(e => e.userId === req.userId);
    
    res.json({ 
      hasAccess,
      course: hasAccess ? {
        _id: course._id,
        title: course.title,
        curriculum: course.curriculum,
        videoUrl: course.videoUrl,
        youtubeVideoId: course.youtubeVideoId
      } : null
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({ error: 'Failed to check course access' });
  }
});

// Get course with progress
router.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user has access
    const hasAccess = course.enrolledUsers.some(e => e.userId === req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get user progress
    const progress = await UserProgress.findOne({
      userId: req.userId,
      courseId: req.params.courseId
    });

    res.json({
      course,
      progress: progress || { 
        completedLessons: [], 
        progressPercentage: 0 
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});
// Add this to backend/routes/user.js after the existing routes

// Check if user has phone number
router.get('/check-phone', requireAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ clerkId: req.userId });
    
    if (user && user.phoneNumber) {
      res.json({ hasPhoneNumber: true, phoneNumber: user.phoneNumber });
    } else {
      res.json({ hasPhoneNumber: false });
    }
  } catch (error) {
    console.error('Check phone error:', error);
    res.json({ hasPhoneNumber: false });
  }
});

// Sync user data from Clerk to DB
router.post('/sync', requireAuth, async (req, res) => {
  try {
    const { phoneNumber, email, firstName, lastName } = req.body;
    
    // Validate phone number is provided
    if (!phoneNumber || phoneNumber.trim() === '') {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone number format (10 digits, Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number' });
    }
    
    // Create or update user in your database
    const User = require('../models/User');
    
    const userData = await User.findOneAndUpdate(
      { clerkId: req.userId },
      {
        clerkId: req.userId,
        email,
        firstName,
        lastName,
        phoneNumber: cleanedPhone,
        lastLogin: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

// Update course progress
router.post('/courses/:courseId/progress', async (req, res) => {
  try {
    const { lessonId, completed } = req.body;
    
    // Verify user has access to the course
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const hasAccess = course.enrolledUsers.some(e => e.userId === req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find or create progress record
    let progress = await UserProgress.findOne({
      userId: req.userId,
      courseId: req.params.courseId
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.userId,
        courseId: req.params.courseId,
        completedLessons: []
      });
    }

    // Update completed lessons
    if (completed && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    } else if (!completed && progress.completedLessons.includes(lessonId)) {
      progress.completedLessons = progress.completedLessons.filter(id => id !== lessonId);
    }

    progress.lastAccessedLesson = lessonId;
    
    // Calculate progress percentage
    const totalLessons = course.curriculum.reduce((sum, module) => 
      sum + module.lessons.length, 0
    );
    progress.progressPercentage = totalLessons > 0 
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    await progress.save();

    // Update course enrollment progress
    await Course.updateOne(
      { _id: req.params.courseId, 'enrolledUsers.userId': req.userId },
      { $set: { 'enrolledUsers.$.progress': progress.progressPercentage } }
    );

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get user dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Count enrolled courses
    const enrolledCount = await Course.countDocuments({
      'enrolledUsers.userId': req.userId
    });

    // Get average progress
    const progressRecords = await UserProgress.find({ userId: req.userId });
    const avgProgress = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / progressRecords.length)
      : 0;

    // Count completed courses (100% progress)
    const completedCount = progressRecords.filter(p => p.progressPercentage === 100).length;

    // Get total payments
    const payments = await Payment.find({ 
      userId: req.userId, 
      status: 'SUCCESS' 
    });
    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      enrolledCourses: enrolledCount,
      completedCourses: completedCount,
      averageProgress: avgProgress,
      totalSpent,
      certificatesEarned: progressRecords.filter(p => p.certificateIssued).length
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;