// frontend/src/pages/LiveProgramDetailPage.jsx
// Detail page for individual live program

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  Clock, Users, Calendar, MapPin, CheckCircle, Video, 
  IndianRupee, ExternalLink, ArrowLeft 
} from 'lucide-react';
import { liveProgramsAPI, userAPI, setAuthToken } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const LiveProgramDetailPage = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [slug]);

  useEffect(() => {
    if (isSignedIn && program) {
      checkAccess();
    }
  }, [isSignedIn, program]);

  const fetchProgram = async () => {
    try {
      const response = await liveProgramsAPI.getBySlug(slug);
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
      alert('Program not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const handleEnroll = () => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }
    navigate(`/live-checkout/${type}/${slug}`);
  };

  const handleJoinMeeting = () => {
    if (program.meetLink) {
      window.open(program.meetLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  const finalPrice = program.discountedPrice || program.price;
  const hasDiscount = program.discountedPrice && program.discountedPrice < program.price;

  const getTypeLabel = (type) => {
    const labels = {
      webinar: 'Webinar',
      mentorship: 'Mentorship Program',
      workshop: 'Workshop',
      guidance: '1:1 Guidance'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {program.thumbnail?.url ? (
                <img
                  src={program.thumbnail.url}
                  alt={program.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              ) : (
                <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                  <Video className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg font-medium">
                  {getTypeLabel(program.type)}
                </span>
                <span className={`px-4 py-2 rounded-lg font-medium ${
                  program.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
                  program.status === 'ongoing' ? 'bg-green-500/10 text-green-400' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
                {program.mode && (
                  <span className={`px-4 py-2 rounded-lg font-medium ${
                    program.mode === 'online' ? 'bg-blue-500/10 text-blue-400' :
                    program.mode === 'offline' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {program.mode.charAt(0).toUpperCase() + program.mode.slice(1)}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{program.title}</h1>
              <p className="text-gray-400 text-lg mb-6">{program.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
                {program.sessionDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(program.sessionDate)}</span>
                  </div>
                )}
                {program.sessionTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{program.sessionTime}</span>
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{program.duration}</span>
                  </div>
                )}
                {program.totalEnrollments > 0 && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{program.totalEnrollments} enrolled</span>
                  </div>
                )}
                {program.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{program.city}</span>
                  </div>
                )}
              </div>

              {program.level && (
                <span className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg font-medium mb-6">
                  {program.level} Level
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4">About This Program</h2>
              <p className="text-gray-400 whitespace-pre-line">{program.description}</p>
            </motion.div>

            {program.agenda && program.agenda.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Agenda</h2>
                <div className="space-y-4">
                  {program.agenda.map((item, index) => (
                    <div key={index} className="border-l-2 border-yellow-500 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        {item.duration && (
                          <span className="text-gray-500 text-sm">{item.duration}</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {program.features && program.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-white mb-4">What You'll Get</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {program.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {program.instructor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Instructor</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{program.instructor}</h3>
                    <p className="text-gray-400">Expert Trading Mentor</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              {program.thumbnail?.url && (
                <img
                  src={program.thumbnail.url}
                  alt={program.title}
                  className="w-full aspect-video object-cover rounded-lg mb-6"
                />
              )}

              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  {hasDiscount && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatCurrency(program.price)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-yellow-400 flex items-center">
                    <IndianRupee className="w-8 h-8" />
                    {finalPrice}
                  </span>
                </div>
                {hasDiscount && (
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                    Save {formatCurrency(program.price - program.discountedPrice)}
                  </span>
                )}
              </div>

              {hasAccess ? (
                <>
                  <button
                    onClick={handleJoinMeeting}
                    disabled={!program.meetLink}
                    className="w-full py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Meeting</span>
                  </button>
                  {program.meetLink && (
                     <a
                      href={program.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-1" />
                      Open in new tab
                    </a>
                  )}
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Enroll Now
                </button>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Live interactive session</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Q&A support</span>
                </div>
                {program.mode === 'online' && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">Join from anywhere</span>
                  </div>
                )}
                {program.maxParticipants && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">Limited to {program.maxParticipants} participants</span>
                  </div>
                )}
              </div>

              {program.sessionDate && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 font-medium text-sm">
                    📅 Scheduled for {formatDate(program.sessionDate)} at {program.sessionTime}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveProgramDetailPage;