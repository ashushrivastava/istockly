// frontend/src/components/About.jsx
// About section component

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about-section" className="py-20 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-yellow-400">iStockly</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              iStockly is India's premier online learning platform dedicated to empowering individuals with comprehensive knowledge in stock market trading and investment strategies.
            </p>
            <p className="text-gray-400 mb-8">
              Founded by industry veterans with over 15 years of combined experience, we've helped thousands of students transform from beginners to successful traders through our structured curriculum and personalized mentorship programs.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  description: 'To democratize financial education and make trading knowledge accessible to everyone.',
                },
                {
                  icon: Eye,
                  title: 'Our Vision',
                  description: 'Building India\'s largest community of informed and successful traders.',
                },
                {
                  icon: Heart,
                  title: 'Our Values',
                  description: 'Integrity, transparency, and student success are at the core of everything we do.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl overflow-hidden border border-yellow-500/30">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-gray-400">Your Journey to Trading Success Starts Here</p>
                </div>
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-8 -left-8 bg-black border border-zinc-800 rounded-xl p-6 shadow-2xl">
              <div className="text-3xl font-bold text-yellow-400 mb-1">15+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>

            <div className="absolute -top-8 -right-8 bg-black border border-zinc-800 rounded-xl p-6 shadow-2xl">
              <div className="text-3xl font-bold text-yellow-400 mb-1">50+</div>
              <div className="text-gray-400 text-sm">Expert Mentors</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;