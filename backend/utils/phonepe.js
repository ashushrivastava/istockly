// backend/utils/phonepe.js
// PhonePe payment gateway integration

const crypto = require('crypto');
const axios = require('axios');

// PhonePe API base URL (use sandbox for testing)
const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/hermes' 
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Generate checksum for PhonePe requests
const generateChecksum = (payload, endpoint = '/pg/v1/pay') => {
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
  const string = payload + endpoint + saltKey;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return sha256 + '###' + saltIndex;
};

// Initiate payment with PhonePe
const initiatePayment = async (paymentData) => {
  try {
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: paymentData.merchantTransactionId,
      merchantUserId: paymentData.userId.substring(0, 36), // Max 36 chars
      amount: Math.round(paymentData.amount * 100), // Convert to paise
      redirectUrl: `${process.env.FRONTEND_URL}/payment/callback?transactionId=${paymentData.merchantTransactionId}`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/callback`,
      mobileNumber: paymentData.userPhone || '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const checksum = generateChecksum(base64Payload);

    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('PhonePe initiation error:', error.response?.data || error.message);
    throw new Error('Payment initiation failed');
  }
};

// Verify payment status
const verifyPayment = async (merchantTransactionId) => {
  try {
    const endpoint = `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
    const string = endpoint + process.env.PHONEPE_SALT_KEY;
    const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + (process.env.PHONEPE_SALT_INDEX || '1');

    const response = await axios.get(
      `${PHONEPE_BASE_URL}${endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': process.env.PHONEPE_MERCHANT_ID
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('PhonePe verification error:', error.response?.data || error.message);
    throw new Error('Payment verification failed');
  }
};

module.exports = { initiatePayment, verifyPayment, generateChecksum };