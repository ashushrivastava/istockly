// frontend/src/pages/AdminPage.jsx
// Admin main page with navigation

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Users, Settings, PlusCircle } from 'lucide-react';

const AdminPage = () => {
  const adminLinks = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'View analytics and statistics',
      path: '/admin/dashboard',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Manage Courses',
      description: 'Edit, delete, and publish courses',
      path: '/admin/dashboard',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: PlusCircle,
      title: 'Add Course',
      description: 'Create a new course',
      path: '/admin/courses/add',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Users,
      title: 'Users',
      description: 'Manage users and enrollments',
      path: '/admin/dashboard',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Admin <span className="text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg">Manage your LMS platform</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.path}
                className="block group"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-yellow-500/50 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {link.title}
                  </h2>
                  <p className="text-gray-400">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;