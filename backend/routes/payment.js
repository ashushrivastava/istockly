// backend/routes/payment.js
// Payment processing routes with PhonePe integration

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const { requireAuth } = require('../middleware/auth');
const { initiatePayment, verifyPayment } = require('../utils/phonepe');
const crypto = require('crypto');

// Initiate payment
router.post('/initiate', requireAuth, async (req, res) => {
  try {
    const { courseId, amount, userEmail, userName, userPhone } = req.body;

    // Validate input
    if (!courseId || !amount || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = course.enrolledUsers.find(
      u => u.userId === req.userId
    );
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create payment record
    const merchantTransactionId = `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    const payment = new Payment({
      userId: req.userId,
      userEmail,
      userName,
      userPhone: userPhone || '9999999999',
      courseId,
      amount,
      merchantTransactionId,
      status: 'PENDING'
    });
    await payment.save();

    // Initiate PhonePe payment
    const paymentResponse = await initiatePayment({
      merchantTransactionId,
      userId: req.userId,
      amount,
      userPhone: userPhone || '9999999999'
    });

    // Update payment with response
    payment.paymentResponse = paymentResponse;
    await payment.save();

    res.json({
      success: true,
      paymentUrl: paymentResponse.data.instrumentResponse.redirectInfo.url,
      merchantTransactionId
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      error: 'Payment initiation failed',
      message: error.message 
    });
  }
});

// PhonePe callback webhook
router.post('/callback', async (req, res) => {
  try {
    const { merchantTransactionId, transactionId, code, message } = req.body;

    console.log('Payment callback received:', req.body);

    // Find payment record
    const payment = await Payment.findOne({ merchantTransactionId });
    if (!payment) {
      console.error('Payment not found:', merchantTransactionId);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Verify payment status with PhonePe
    let paymentStatus;
    try {
      paymentStatus = await verifyPayment(merchantTransactionId);
    } catch (verifyError) {
      console.error('Payment verification failed:', verifyError);
      payment.status = 'FAILED';
      payment.paymentResponse = { error: verifyError.message };
      await payment.save();
      return res.json({ success: false });
    }

    // Update payment status
    const isSuccess = paymentStatus.code === 'PAYMENT_SUCCESS';
    payment.status = isSuccess ? 'SUCCESS' : 'FAILED';
    payment.transactionId = paymentStatus.data?.transactionId || transactionId;
    payment.paymentResponse = paymentStatus;
    await payment.save();

    // If successful, enroll user in course
    if (isSuccess) {
      const course = await Course.findById(payment.courseId);
      if (course) {
        course.enrolledUsers.push({
          userId: payment.userId,
          enrolledAt: new Date(),
          progress: 0
        });
        course.totalEnrollments += 1;
        await course.save();
      }
    }

    res.json({ success: isSuccess });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
});

// Check payment status
router.get('/status/:transactionId', requireAuth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      merchantTransactionId: req.params.transactionId,
      userId: req.userId 
    }).populate('courseId', 'title slug thumbnail');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ 
      status: payment.status,
      payment 
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Get user's payment history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('courseId', 'title slug thumbnail')
      .sort('-createdAt');
    
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;