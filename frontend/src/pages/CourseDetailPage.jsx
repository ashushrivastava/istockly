// frontend/src/pages/CourseDetailPage.jsx
// Individual course detail page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Clock, Users, Star, CheckCircle, PlayCircle, IndianRupee } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { coursesAPI, userAPI, setAuthToken } from '../utils/api';
import { formatCurrency } from '../lib/utils';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (isSignedIn && course) {
      checkAccess();
    }
  }, [isSignedIn, course]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getBySlug(slug);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await userAPI.checkCourseAccess(course._id);
      setHasAccess(response.data.hasAccess);
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const handlePurchase = () => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }
    
    // Navigate to checkout page
    navigate(`/checkout/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = course.discountedPrice || course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {course.youtubeVideoId ? (
                <VideoPlayer videoId={course.youtubeVideoId} title={course.title} />
              ) : (
                <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </motion.div>

            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-gray-400 text-lg mb-6">{course.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
                {course.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.totalEnrollments > 0 && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{course.totalEnrollments} students enrolled</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating} rating</span>
                  </div>
                )}
              </div>

              {course.level && (
                <span className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg font-medium mb-6">
                  {course.level} Level
                </span>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
              <p className="text-gray-400 whitespace-pre-line">{course.description}</p>
            </motion.div>

            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="border border-zinc-800 rounded-lg overflow-hidden">
                      <div className="bg-zinc-800/50 p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {module.moduleTitle}
                        </h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center space-x-3">
                              <PlayCircle className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">{lesson.title}</span>
                            </div>
                            {lesson.duration && (
                              <span className="text-gray-500 text-sm">{lesson.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Instructor */}
            {course.instructor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Instructor</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{course.instructor}</h3>
                    <p className="text-gray-400">Expert Trading Mentor</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              {course.thumbnail?.url && (
                <img
                  src={course.thumbnail.url}
                  alt={course.title}
                  className="w-full aspect-video object-cover rounded-lg mb-6"
                />
              )}

              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  {hasDiscount && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatCurrency(course.price)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-yellow-400 flex items-center">
                    <IndianRupee className="w-8 h-8" />
                    {finalPrice}
                  </span>
                </div>
                {hasDiscount && (
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                    Save {formatCurrency(course.price - course.discountedPrice)}
                  </span>
                )}
              </div>

              {hasAccess ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Buy Now
                </button>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Lifetime access</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">24/7 support</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Access on mobile and desktop</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;