// frontend/src/pages/LiveGuidancePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { liveProgramsAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const LiveGuidancePage = () => {
  const [guidancePrograms, setGuidancePrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidancePrograms();
  }, []);

  const fetchGuidancePrograms = async () => {
    try {
      const response = await liveProgramsAPI.getByType('guidance');
      setGuidancePrograms(response.data);
    } catch (error) {
      console.error('Error fetching guidance programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Phone className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            1:1 Guidance
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get personalized trading guidance from industry experts, tailored just for you
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 text-gray-300">
              <Phone className="w-5 h-5 text-green-400" />
              <span>One-on-one private sessions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-5 h-5 text-green-400" />
              <span>Customized trading roadmap</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Solve your specific doubts</span>
            </div>
          </div>
        </motion.div>

        {/* Guidance Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            <span className="text-yellow-400 font-semibold">{guidancePrograms.length}</span> guidance program{guidancePrograms.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Guidance Programs Grid */}
        {guidancePrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidancePrograms.map((program, index) => (
              <motion.div
                key={program._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/live/guidance/${program.slug}`}
                  className="block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500 transition-all group"
                >
                  {/* Thumbnail */}
                  {program.thumbnail?.url ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={program.thumbnail.url}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      <Phone className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      program.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
                      program.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </span>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {program.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {program.shortDescription}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      {program.sessionDate && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(program.sessionDate)} at {program.sessionTime}
                        </div>
                      )}
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        {program.totalEnrollments || 0} enrolled
                      </div>
                      {program.instructor && (
                        <div className="text-gray-400 text-sm">
                          By {program.instructor}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div>
                        {program.discountedPrice ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-yellow-400">
                              {formatCurrency(program.discountedPrice)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                              {formatCurrency(program.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(program.price)}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Phone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No guidance programs available at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveGuidancePage;










