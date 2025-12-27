// frontend/src/pages/AdminDashboard.jsx
// Admin dashboard with analytics and course management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, BookOpen, TrendingUp, Edit, Trash2, Eye, EyeOff, Video, Phone, Mail } from 'lucide-react';
import { adminAPI, setAuthToken } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const AdminDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [dbUsers, setDbUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      setAuthToken(token);

      const [analyticsRes, coursesRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getAllCourses(),
      ]);

      setAnalytics(analyticsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const token = await getToken();
      setAuthToken(token);
      const response = await adminAPI.getUsersFromDB();
      setDbUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (getToken) {
      fetchUsers();
    }
  }, [getToken]);

  const handleTogglePublish = async (courseId) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await adminAPI.togglePublish(courseId);
      fetchData();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update course status');
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      await adminAPI.deleteCourse(courseId);
      fetchData();
      alert('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage courses, live programs and view analytics</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/live-programs"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <Video className="w-5 h-5" />
              <span>Live Programs</span>
            </Link>
            <Link
              to="/admin/courses/add"
              className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Add New Course
            </Link>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/admin/courses/add"
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-yellow-500 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  Manage Courses
                </h3>
                <p className="text-gray-400 text-sm">
                  Create and manage your online courses
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-yellow-400" />
            </div>
          </Link>

          <Link
            to="/admin/live-programs"
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Manage Live Programs
                </h3>
                <p className="text-gray-400 text-sm">
                  Create webinars, mentorship, workshops & 1:1 guidance
                </p>
              </div>
              <Video className="w-12 h-12 text-blue-400" />
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <DollarSign className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(analytics.totalRevenue)}
              </div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <Users className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {analytics.totalUsers}
              </div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <BookOpen className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {analytics.totalCourses}
              </div>
              <div className="text-gray-400 text-sm">Total Courses</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
            >
              <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {analytics.totalEnrollments}
              </div>
              <div className="text-gray-400 text-sm">Total Enrollments</div>
            </motion.div>
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-12">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">All Courses ({courses.length})</h2>
            <Link
              to="/admin/courses/add"
              className="text-yellow-400 hover:text-yellow-500 text-sm font-medium transition-colors"
            >
              + Add Course
            </Link>
          </div>
          
          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Enrollments</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {course.thumbnail?.url && (
                            <img
                              src={course.thumbnail.url}
                              alt={course.title}
                              className="w-16 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium text-white">{course.title}</div>
                            <div className="text-sm text-gray-400">{course.instructor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{course.category || 'N/A'}</td>
                      <td className="px-6 py-4 text-white">
                        {formatCurrency(course.discountedPrice || course.price)}
                      </td>
                      <td className="px-6 py-4 text-white">{course.totalEnrollments || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            course.isPublished
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/courses/edit/${course._id}`}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(course._id)}
                            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                            title={course.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id, course.title)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No courses yet</p>
              <Link
                to="/admin/courses/add"
                className="inline-block px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Create Your First Course
              </Link>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        {analytics?.recentTransactions && analytics.recentTransactions.length > 0 && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-12">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {analytics.recentTransactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4 text-white">{transaction.courseId?.title || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-300">{transaction.userEmail}</td>
                      <td className="px-6 py-4 text-white">{formatCurrency(transaction.amount)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'SUCCESS'
                              ? 'bg-green-500/10 text-green-400'
                              : transaction.status === 'PENDING'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Section */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Users ({dbUsers.length})</h2>
            <button
              onClick={fetchUsers}
              className="text-yellow-400 hover:text-yellow-500 text-sm font-medium transition-colors flex items-center gap-2"
              disabled={usersLoading}
            >
              <Users className="w-4 h-4" />
              {usersLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {usersLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          ) : dbUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Mobile Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Login</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {dbUsers.map((dbUser) => (
                    <tr key={dbUser._id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {dbUser.firstName || dbUser.lastName 
                            ? `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{dbUser.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{dbUser.phoneNumber ? `+91 ${dbUser.phoneNumber}` : 'Not provided'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            dbUser.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {dbUser.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {dbUser.lastLogin ? formatDate(dbUser.lastLogin) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {dbUser.createdAt ? formatDate(dbUser.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;