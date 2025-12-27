// frontend/src/pages/OfflinePage.jsx
// Offline programs page

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfflinePage = () => {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Offline <span className="text-yellow-400">Programs</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Join our classroom programs for hands-on learning experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, label: 'Small Batches', value: '15-20 students' },
            { icon: Calendar, label: 'Duration', value: '3-6 months' },
            { icon: Award, label: 'Certification', value: 'Industry Recognized' },
            { icon: MapPin, label: 'Locations', value: 'Multiple Cities' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <item.icon className="w-10 h-10 text-yellow-400 mb-4" />
              <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
              <div className="text-gray-400">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-zinc-900 rounded-xl p-12 border border-zinc-800 text-center">
          <Calendar className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            We're setting up offline training centers across India. Be the first to know when we launch in your city.
          </p>
          <Link
            to="/offline/centers"
            className="inline-block px-8 py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            View Upcoming Locations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;