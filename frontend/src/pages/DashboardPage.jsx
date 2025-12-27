// frontend/src/pages/DashboardPage.jsx
// User dashboard for enrolled courses

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';
import { userAPI, setAuthToken } from '../utils/api';

const DashboardPage = () => {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await user.getToken();
      setAuthToken(token);

      const [coursesRes, statsRes] = await Promise.all([
        userAPI.getEnrolledCourses(),
        userAPI.getDashboardStats(),
      ]);

      setEnrolledCourses(coursesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'Student'}!
          </h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                label: 'Enrolled Courses',
                value: stats.enrolledCourses,
                color: 'text-blue-400',
              },
              {
                icon: Award,
                label: 'Completed',
                value: stats.completedCourses,
                color: 'text-green-400',
              },
              {
                icon: TrendingUp,
                label: 'Average Progress',
                value: `${stats.averageProgress}%`,
                color: 'text-yellow-400',
              },
              {
                icon: Clock,
                label: 'Certificates',
                value: stats.certificatesEarned,
                color: 'text-purple-400',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Enrolled Courses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment, index) => (
                <motion.div
                  key={enrollment.course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all"
                >
                  <Link to={`/courses/${enrollment.course.slug}`}>
                    {enrollment.course.thumbnail?.url && (
                      <img
                        src={enrollment.course.thumbnail.url}
                        alt={enrollment.course.title}
                        className="w-full aspect-video object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {enrollment.course.shortDescription}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-yellow-400">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet</p>
              <Link
                to="/courses"
                className="inline-block px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;