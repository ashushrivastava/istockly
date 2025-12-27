// frontend/src/components/TrustBadges.jsx
// Trust badges and recognition section

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Users, TrendingUp } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Award,
      title: 'Certified Programs',
      description: 'Industry-recognized certifications',
    },
    {
      icon: Shield,
      title: 'Secure Learning',
      description: '100% secure payment & data',
    },
    {
      icon: Users,
      title: '10,000+ Students',
      description: 'Join our growing community',
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: '95% student success rate',
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-400">
            Join India's most trusted trading education platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <badge.icon className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-400">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recognition Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-8">Recognized By</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="text-gray-600 font-bold text-2xl">STARTUP INDIA</div>
            <div className="text-gray-600 font-bold text-2xl">NSDC</div>
            <div className="text-gray-600 font-bold text-2xl">NIFTY</div>
            <div className="text-gray-600 font-bold text-2xl">BSE</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadges;