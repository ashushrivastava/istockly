// frontend/src/pages/LiveWebinarsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { liveProgramsAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const LiveWebinarsPage = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await liveProgramsAPI.getByType('webinar');
      setWebinars(response.data);
    } catch (error) {
      console.error('Error fetching webinars:', error);
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
            <Video className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Webinars
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest trading and investing strategies through our expert-led live webinars
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 text-gray-300">
              <Video className="w-5 h-5 text-green-400" />
              <span>Real-time market discussions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-5 h-5 text-green-400" />
              <span>Interactive Q&A sessions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Access recordings anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Webinar Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            <span className="text-yellow-400 font-semibold">{webinars.length}</span> webinar{webinars.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Webinars Grid */}
        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((webinar, index) => (
              <motion.div
                key={webinar._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/live/webinar/${webinar.slug}`}
                  className="block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500 transition-all group"
                >
                  {/* Thumbnail */}
                  {webinar.thumbnail?.url ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={webinar.thumbnail.url}
                        alt={webinar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      <Video className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      webinar.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
                      webinar.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                    </span>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {webinar.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {webinar.shortDescription}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      {webinar.sessionDate && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(webinar.sessionDate)} at {webinar.sessionTime}
                        </div>
                      )}
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        {webinar.totalEnrollments || 0} enrolled
                      </div>
                      {webinar.instructor && (
                        <div className="text-gray-400 text-sm">
                          By {webinar.instructor}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div>
                        {webinar.discountedPrice ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-yellow-400">
                              {formatCurrency(webinar.discountedPrice)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                              {formatCurrency(webinar.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(webinar.price)}
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
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No webinars available at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveWebinarsPage;