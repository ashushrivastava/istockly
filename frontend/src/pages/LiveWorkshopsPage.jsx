// frontend/src/pages/LiveWorkshopsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { liveProgramsAPI } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const LiveWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await liveProgramsAPI.getByType('workshop');
      setWorkshops(response.data);
    } catch (error) {
      console.error('Error fetching workshops:', error);
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
            <Briefcase className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Workshops
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hands-on stock market & trading workshops in both online and offline modes
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 text-gray-300">
              <Briefcase className="w-5 h-5 text-green-400" />
              <span>Practical learning with real-time examples</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Short, focused learning modules</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-5 h-5 text-green-400" />
              <span>Offline sessions in major cities</span>
            </div>
          </div>
        </motion.div>

        {/* Workshop Count */}
        <div className="mb-8">
          <p className="text-gray-400">
            <span className="text-yellow-400 font-semibold">{workshops.length}</span> workshop{workshops.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Workshops Grid */}
        {workshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/live/workshop/${workshop.slug}`}
                  className="block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500 transition-all group"
                >
                  {workshop.thumbnail?.url ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={workshop.thumbnail.url}
                        alt={workshop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      <Briefcase className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        workshop.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
                        workshop.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}
                      </span>
                      {workshop.mode && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          workshop.mode === 'online' ? 'bg-blue-500/10 text-blue-400' :
                          workshop.mode === 'offline' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {workshop.mode.charAt(0).toUpperCase() + workshop.mode.slice(1)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {workshop.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {workshop.shortDescription}
                    </p>

                    <div className="space-y-2 mb-4">
                      {workshop.sessionDate && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(workshop.sessionDate)} at {workshop.sessionTime}
                        </div>
                      )}
                      {workshop.city && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {workshop.city}
                        </div>
                      )}
                      {workshop.instructor && (
                        <div className="text-gray-400 text-sm">
                          By {workshop.instructor}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div>
                        {workshop.discountedPrice ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-yellow-400">
                              {formatCurrency(workshop.discountedPrice)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                              {formatCurrency(workshop.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-yellow-400">
                            {formatCurrency(workshop.price)}
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
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No workshops available at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming workshops</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveWorkshopsPage;