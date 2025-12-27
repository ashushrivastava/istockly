// frontend/src/pages/PaymentFailed.jsx
// Payment failure page

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionId');

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
            className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-400" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
          <p className="text-gray-400 text-lg mb-2">
            Unfortunately, your payment could not be processed.
          </p>
          {transactionId && (
            <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 w-full py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          <Link
            to="/courses"
            className="flex items-center justify-center space-x-2 w-full py-4 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h3 className="text-white font-semibold mb-2">Common Issues</h3>
          <ul className="text-sm text-gray-400 space-y-2 text-left">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect payment details</li>
            <li>• Network connectivity issues</li>
            <li>• Transaction timeout</li>
          </ul>
          <p className="text-sm text-gray-400 mt-4">
            If the problem persists, please contact support at{' '}
            <a href="mailto:support@istockly.com" className="text-yellow-400 hover:underline">
              support@istockly.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;