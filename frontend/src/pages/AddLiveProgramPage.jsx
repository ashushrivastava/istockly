// frontend/src/pages/AddLiveProgramPage.jsx
// Form to add or edit live programs

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Save, Video } from 'lucide-react';
import { adminLiveProgramsAPI, uploadAPI, setAuthToken } from '../utils/api';
import { generateSlug } from '../lib/utils';

const AddLiveProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useAuth();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'webinar',
    description: '',
    shortDescription: '',
    instructor: '',
    price: '',
    discountedPrice: '',
    duration: '',
    level: 'Beginner',
    thumbnail: { url: '', publicId: '' },
    meetLink: '',
    sessionDate: '',
    sessionTime: '',
    timezone: 'Asia/Kolkata',
    maxParticipants: '',
    mode: 'online',
    location: '',
    city: '',
    agenda: [{ title: '', description: '', duration: '' }],
    features: [''],
    isPublished: true,
    status: 'upcoming',
  });

  const fetchProgram = useCallback(async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await adminLiveProgramsAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
      alert('Failed to load program');
    }
  }, [id, getToken]);

  useEffect(() => {
    if (isEditMode && isLoaded) {
      fetchProgram();
    }
  }, [isEditMode, isLoaded, fetchProgram]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = await getToken();
      setAuthToken(token);

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await uploadAPI.uploadImage(uploadFormData);
      setFormData((prev) => ({
        ...prev,
        thumbnail: {
          url: response.data.url,
          publicId: response.data.publicId,
        },
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAgendaChange = (index, field, value) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index][field] = value;
    setFormData((prev) => ({ ...prev, agenda: newAgenda }));
  };

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { title: '', description: '', duration: '' }],
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.instructor) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      setAuthToken(token);

      const submitData = { ...formData };
      submitData.price = Number(submitData.price);
      if (submitData.discountedPrice) {
        submitData.discountedPrice = Number(submitData.discountedPrice);
      }
      if (submitData.maxParticipants) {
        submitData.maxParticipants = Number(submitData.maxParticipants);
      }

      // Remove empty features
      submitData.features = submitData.features.filter(f => f.trim());

      if (isEditMode) {
        await adminLiveProgramsAPI.update(id, submitData);
        alert('Program updated successfully');
      } else {
        await adminLiveProgramsAPI.create(submitData);
        alert('Program created successfully');
      }

      navigate('/admin/live-programs');
    } catch (error) {
      console.error('Error saving program:', error);
      alert(error.response?.data?.error || 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">
            {isEditMode ? 'Edit Live Program' : 'Add New Live Program'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Program Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="webinar">Webinar</option>
                      <option value="mentorship">Mentorship Program</option>
                      <option value="workshop">Workshop</option>
                      <option value="guidance">1:1 Guidance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Discounted Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hours"
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 text-black rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors">
                      <Upload className="w-5 h-5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {formData.thumbnail.url && (
                      <img
                        src={formData.thumbnail.url}
                        alt="Thumbnail"
                        className="w-24 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">Session Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Google Meet Link
                  </label>
                  <input
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleInputChange}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Enter the Google Meet link for this session
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Date
                    </label>
                    <input
                      type="date"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Time
                    </label>
                    <input
                      type="time"
                      name="sessionTime"
                      value={formData.sessionTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mode
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {(formData.mode === 'offline' || formData.mode === 'both') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Venue address"
                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Mumbai"
                        className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Agenda</h2>
                <button
                  type="button"
                  onClick={addAgendaItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.agenda.map((item, index) => (
                  <div key={index} className="border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-gray-400 text-sm">Item {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(index)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
                        placeholder="Title"
                        className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => handleAgendaChange(index, 'description', e.target.value)}
                        placeholder="Description"
                        rows="2"
                        className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => handleAgendaChange(index, 'duration', e.target.value)}
                        placeholder="Duration (e.g., 30 mins)"
                        className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Features / Benefits</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-300">Publish this program</label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-8 py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : isEditMode ? 'Update Program' : 'Create Program'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/live-programs')}
                className="px-8 py-4 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddLiveProgramPage;