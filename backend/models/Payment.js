// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String },
  userPhone: { type: String },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  amount: { type: Number, required: true },
  transactionId: { type: String, unique: true, sparse: true },
  merchantTransactionId: { type: String, required: true }, // REMOVED unique: true
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  },
  paymentResponse: { type: Object },
  paymentMethod: { type: String },
  refundStatus: { type: String },
  refundAmount: { type: Number }
}, {
  timestamps: true
});

// Index for faster queries - REMOVED duplicate merchantTransactionId index
paymentSchema.index({ userId: 1, courseId: 1 });
paymentSchema.index({ merchantTransactionId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);