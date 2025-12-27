// frontend/src/components/ComingSoon.jsx
// Coming soon page template

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ pageName }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <Clock className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {pageName}
        </h1>
        <p className="text-xl text-gray-400 mb-4">Coming Soon</p>
        <p className="text-gray-500 mb-8">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;