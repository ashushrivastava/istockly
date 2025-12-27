// frontend/src/components/PhoneNumberCollector.jsx
// Component to collect phone number after Clerk authentication

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const PhoneNumberCollector = ({ user, onComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Prevent navigation away without phone number
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isValid) {
        e.preventDefault();
        e.returnValue = 'You must provide a phone number to continue. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isValid]);

  const validatePhone = (phone) => {
    // Indian phone number validation: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, ''); // Remove non-digits
    
    if (cleaned.length === 10 && phoneRegex.test(cleaned)) {
      setIsValid(true);
      setError('');
      return cleaned;
    } else if (cleaned.length > 0) {
      setIsValid(false);
      setError('Please enter a valid 10-digit Indian mobile number');
      return null;
    } else {
      setIsValid(false);
      setError('');
      return null;
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const cleanedPhone = validatePhone(phoneNumber);
    if (!cleanedPhone) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!user) {
      setError('User information not available');
      return;
    }

    try {
      setLoading(true);
      const token = await user.getToken();
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sync`,
        {
          phoneNumber: cleanedPhone,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      onComplete();
    } catch (error) {
      console.error('Error syncing user:', error);
      setError(error.response?.data?.error || 'Failed to save phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 border-2 border-yellow-400/30 rounded-2xl p-8 shadow-2xl shadow-yellow-400/10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400/30"
            >
              <Phone className="w-10 h-10 text-yellow-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Phone Number Required</h2>
            <p className="text-gray-300 text-base">You must provide your mobile number to continue</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="text-red-400 text-sm font-semibold">* Mandatory Field</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Mobile Number <span className="text-red-400 text-lg">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-700 pr-3">
                  <span className="text-yellow-400 text-base font-semibold">+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className={`w-full pl-20 pr-12 py-4 bg-gray-800 border-2 rounded-lg text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-500/50 bg-red-950/20'
                      : isValid
                      ? 'border-green-500 focus:ring-green-500/50 bg-green-950/10'
                      : 'border-gray-700 focus:border-yellow-400 focus:ring-yellow-400/50'
                  }`}
                  required
                  autoFocus
                />
                {isValid && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                )}
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-red-400 text-sm font-medium bg-red-950/20 border border-red-500/30 rounded-lg p-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {!error && phoneNumber && !isValid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-yellow-400 text-sm bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Enter a valid 10-digit Indian mobile number (starting with 6-9)</span>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !isValid}
              whileHover={{ scale: loading || !isValid ? 1 : 1.02 }}
              whileTap={{ scale: loading || !isValid ? 1 : 0.98 }}
              className={`w-full py-4 rounded-lg font-bold text-base transition-all ${
                loading || !isValid
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-2 border-gray-600'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 border-2 border-yellow-400'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-blue-950/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center leading-relaxed">
              <span className="font-semibold">Note:</span> Your phone number is required for account verification and important updates. This field cannot be skipped.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneNumberCollector;

