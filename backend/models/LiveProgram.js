// backend/models/LiveProgram.js
// MongoDB schema for Live Programs (Webinars, Mentorship, Workshops, 1:1 Guidance)

const mongoose = require('mongoose');

const liveProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true,
    enum: ['webinar', 'mentorship', 'workshop', 'guidance']
  },
  description: { type: String, required: true },
  shortDescription: { type: String },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  duration: { type: String },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnail: {
    url: String,
    publicId: String
  },
  
  // Live session details
  meetLink: { type: String },
  sessionDate: { type: Date },
  sessionTime: { type: String },
  timezone: { type: String, default: 'Asia/Kolkata' },
  maxParticipants: { type: Number },
  
  // Workshop specific
  mode: {
    type: String,
    enum: ['online', 'offline', 'both'],
    default: 'online'
  },
  location: { type: String }, // For offline workshops
  city: { type: String },
  
  // Curriculum/Agenda
  agenda: [{
    title: String,
    description: String,
    duration: String
  }],
  
  // Features/Benefits
  features: [String],
  
  // Enrolled users
  enrolledUsers: [{
    userId: String,
    userName: String,
    userEmail: String,
    enrolledAt: { type: Date, default: Date.now }
  }],
  
  totalEnrollments: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Create slug from title if not provided
liveProgramSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('LiveProgram', liveProgramSchema);