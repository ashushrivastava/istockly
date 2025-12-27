// frontend/src/pages/AddCoursePage.jsx
// Add/Edit course page for admin

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Save } from 'lucide-react';
import { adminAPI, uploadAPI, setAuthToken } from '../utils/api';
import { generateSlug, extractYouTubeId } from '../lib/utils';

const AddCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded } = useAuth();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    instructor: '',
    price: '',
    discountedPrice: '',
    duration: '',
    level: 'Beginner',
    category: '',
    videoUrl: '',
    thumbnail: { url: '', publicId: '' },
    curriculum: [{ moduleTitle: '', lessons: [{ title: '', duration: '', videoUrl: '' }] }],
    isPublished: true,
  });

  const fetchCourse = useCallback(async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const response = await adminAPI.getCourse(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to load course');
    }
  }, [id, getToken]);

  useEffect(() => {
    if (isEditMode && isLoaded) {
      fetchCourse();
    }
  }, [isEditMode, isLoaded, fetchCourse]);

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

    if (!isLoaded) {
      alert('Please wait, loading user data...');
      return;
    }

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
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCurriculumChange = (moduleIndex, field, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex][field] = value;
    setFormData((prev) => ({ ...prev, curriculum: newCurriculum }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].lessons[lessonIndex][field] = value;
    setFormData((prev) => ({ ...prev, curriculum: newCurriculum }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        { moduleTitle: '', lessons: [{ title: '', duration: '', videoUrl: '' }] },
      ],
    }));
  };

  const removeModule = (moduleIndex) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== moduleIndex),
    }));
  };

  const addLesson = (moduleIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].lessons.push({ title: '', duration: '', videoUrl: '' });
    setFormData((prev) => ({ ...prev, curriculum: newCurriculum }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[moduleIndex].lessons = newCurriculum[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setFormData((prev) => ({ ...prev, curriculum: newCurriculum }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title || !formData.price || !formData.instructor) {
    alert('Please fill in all required fields');
    return;
  }

  if (!formData.description) {
    alert('Description is required');
    return;
  }

  if (!isLoaded) {
    alert('Please wait, loading...');
    return;
  }

  try {
    setLoading(true);
    const token = await getToken();
    setAuthToken(token);

    const submitData = { ...formData };

    // Ensure price is a number
    submitData.price = Number(submitData.price);
    if (submitData.discountedPrice) {
      submitData.discountedPrice = Number(submitData.discountedPrice);
    }

    // Extract YouTube ID from video URL
    if (submitData.videoUrl) {
      const videoId = extractYouTubeId(submitData.videoUrl);
      submitData.youtubeVideoId = videoId;
    }

    console.log('Submitting course data:', submitData);

    if (isEditMode) {
      const response = await adminAPI.updateCourse(id, submitData);
      console.log('Course updated:', response.data);
      alert('Course updated successfully');
    } else {
      const response = await adminAPI.createCourse(submitData);
      console.log('Course created:', response.data);
      alert('Course created successfully');
    }

    navigate('/admin/dashboard');
  } catch (error) {
    console.error('Error saving course:', error);
    console.error('Error response:', error.response?.data);
    
    // Show specific error message
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.details?.join(', ') || 
                        'Failed to save course';
    alert(errorMessage);
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
            {isEditMode ? 'Edit Course' : 'Add New Course'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

              <div className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
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
                      placeholder="e.g., 10 hours"
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
                    YouTube Video URL (Unlisted)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-gray-300">Publish course</label>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Curriculum</h2>
                <button
                  type="button"
                  onClick={addModule}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <input
                        type="text"
                        value={module.moduleTitle}
                        onChange={(e) =>
                          handleCurriculumChange(moduleIndex, 'moduleTitle', e.target.value)
                        }
                        placeholder="Module Title"
                        className="flex-1 px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="ml-2 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) =>
                              handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'title',
                                e.target.value
                              )
                            }
                            placeholder="Lesson Title"
                            className="flex-1 px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                          />
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) =>
                              handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'duration',
                                e.target.value
                              )
                            }
                            placeholder="Duration"
                            className="w-24 px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                          />
                          <input
                            type="url"
                            value={lesson.videoUrl}
                            onChange={(e) =>
                              handleLessonChange(
                                moduleIndex,
                                lessonIndex,
                                'videoUrl',
                                e.target.value
                              )
                            }
                            placeholder="Video URL"
                            className="flex-1 px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="mt-3 text-sm text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      + Add Lesson
                    </button>
                  </div>
                ))}
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
                <span>{loading ? 'Saving...' : isEditMode ? 'Update Course' : 'Create Course'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
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

export default AddCoursePage;