// backend/models/Course.js
// MongoDB schema for Course collection

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
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
  category: { type: String },
  thumbnail: {
    url: String,
    publicId: String
  },
  videoUrl: { type: String },
  youtubeVideoId: { type: String },
  curriculum: [{
    moduleTitle: String,
    lessons: [{
      title: String,
      duration: String,
      videoUrl: String
    }]
  }],
  enrolledUsers: [{
    userId: String,
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
  rating: { type: Number, default: 4.5 },
  reviews: [{
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  totalEnrollments: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Extract YouTube video ID before saving
courseSchema.pre('save', function(next) {
  if (this.videoUrl && this.isModified('videoUrl')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = this.videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      this.youtubeVideoId = match[2];
    }
  }
  next();
});

// Create slug from title if not provided
courseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);