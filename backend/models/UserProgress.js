// backend/models/UserProgress.js
// MongoDB schema for tracking user course progress

const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  completedLessons: [{ type: String }],
  lastAccessedLesson: { type: String },
  progressPercentage: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },
  certificateIssuedAt: { type: Date },
  totalWatchTime: { type: Number, default: 0 }, // in minutes
  lastAccessedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Unique index to prevent duplicate progress records
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Update lastAccessedAt on every save
userProgressSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  next();
});

module.exports = mongoose.model('UserProgress', userProgressSchema);