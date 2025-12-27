// frontend/src/pages/PaymentSuccess.jsx
// Payment success page

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!showConfetti) {
      setShowConfetti(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 text-lg mb-2">
            Thank you for your purchase. Your enrollment is now active.
          </p>
          {transactionId && (
            <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
          )}
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/courses"
            className="flex items-center justify-center space-x-2 w-full py-4 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
          >
            <span>Browse More Courses</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h3 className="text-white font-semibold mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-400 space-y-2 text-left">
            <li>• Access your course from the dashboard</li>
            <li>• Start learning at your own pace</li>
            <li>• Track your progress</li>
            <li>• Earn your certificate upon completion</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;