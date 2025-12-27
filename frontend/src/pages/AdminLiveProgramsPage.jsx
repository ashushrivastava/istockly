// frontend/src/pages/AdminLiveProgramsPage.jsx
// Admin page to manage live programs

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Video } from 'lucide-react';
import { adminLiveProgramsAPI, setAuthToken } from '../utils/api';
import { formatCurrency, formatDate } from '../lib/utils';

const AdminLiveProgramsPage = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, webinar, mentorship, workshop, guidance

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await adminLiveProgramsAPI.getAll();
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      alert('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await adminLiveProgramsAPI.togglePublish(id);
      fetchPrograms();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      await adminLiveProgramsAPI.delete(id);
      fetchPrograms();
      alert('Program deleted successfully');
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    }
  };

  const filteredPrograms = filter === 'all' 
    ? programs 
    : programs.filter(p => p.type === filter);

  const getTypeLabel = (type) => {
    const labels = {
      webinar: 'Webinar',
      mentorship: 'Mentorship',
      workshop: 'Workshop',
      guidance: '1:1 Guidance'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      webinar: 'bg-blue-500/10 text-blue-400',
      mentorship: 'bg-green-500/10 text-green-400',
      workshop: 'bg-purple-500/10 text-purple-400',
      guidance: 'bg-yellow-500/10 text-yellow-400'
    };
    return colors[type] || 'bg-gray-500/10 text-gray-400';
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Live Programs</h1>
            <p className="text-gray-400">Manage webinars, mentorship, workshops & 1:1 guidance</p>
          </div>
          <Link
            to="/admin/live-programs/add"
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Live Program</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {['all', 'webinar', 'mentorship', 'workshop', 'guidance'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-yellow-500 text-black'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              {type === 'all' ? 'All Programs' : getTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Programs Table */}
        {filteredPrograms.length > 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Program</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Enrolled</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredPrograms.map((program) => (
                    <tr key={program._id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {program.thumbnail?.url ? (
                            <img
                              src={program.thumbnail.url}
                              alt={program.title}
                              className="w-16 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-10 bg-zinc-800 rounded flex items-center justify-center">
                              <Video className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{program.title}</div>
                            <div className="text-sm text-gray-400">{program.instructor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(program.type)}`}>
                          {getTypeLabel(program.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {program.sessionDate ? (
                          <>
                            <div>{formatDate(program.sessionDate)}</div>
                            <div className="text-gray-500">{program.sessionTime}</div>
                          </>
                        ) : (
                          <span className="text-gray-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {formatCurrency(program.discountedPrice || program.price)}
                      </td>
                      <td className="px-6 py-4 text-white">{program.totalEnrollments || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            program.isPublished
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {program.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/live-programs/edit/${program._id}`}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(program._id)}
                            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                            title={program.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {program.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(program._id, program.title)}
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
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No programs found</p>
            <Link
              to="/admin/live-programs/add"
              className="inline-block px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Create Your First Program
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveProgramsPage;