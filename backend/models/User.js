// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);