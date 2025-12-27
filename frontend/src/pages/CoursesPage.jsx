import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Star, Users, BookOpen, Clock, TrendingUp, BarChart3, 
  Play, ChevronRight, ExternalLink, X, SlidersHorizontal, Grid3X3, 
  List, ArrowUpDown, Heart, Share2, Award, Zap, Crown, Sparkles,
  ArrowLeft, ArrowRight, CheckCircle, Timer, Target, Brain
} from 'lucide-react';
import { coursesAPI } from '../utils/api';
import { formatCurrency } from '../lib/utils';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [showPromo, setShowPromo] = useState(true);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const coursesPerPage = 9;

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = { published: true };
      const response = await coursesAPI.getAll(params);
      const coursesData = response.data.courses || response.data || [];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await coursesAPI.getCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Build categories with counts
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryIcons = {
    'Options Trading': '⚡',
    'Technical Analysis': '📈',
    'Trading Strategies': '🎯',
    'Price Action Trading': '📊',
    'Stock Market Basics': '📚',
    'Investing': '💰',
    'Crypto': '₿'
  };

  const builtCategories = [
    { name: 'All Courses', count: courses.length, icon: '📚' },
    ...categories.map(cat => ({
      name: cat,
      count: categoryCounts[cat] || 0,
      icon: categoryIcons[cat] || '📚'
    }))
  ];

  // Get popular courses (top 3 by enrollment)
  const popularCourses = [...courses]
    .sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
    .slice(0, 3)
    .map(course => course.title);

  // Format course data
  const formatCourse = (course) => {
    const price = course.discountedPrice || course.price || 0;
    const originalPrice = course.price || 0;
    const discount = originalPrice > price && originalPrice > 0 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : 0;

    return {
      id: course._id || course.id,
      title: course.title || 'Untitled Course',
      instructor: course.instructor || 'Expert Instructor',
      rating: course.rating || 4.5,
      students: course.totalEnrollments || course.enrollments || 0,
      duration: course.duration || '10 hours',
      level: course.level || 'Beginner',
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      category: course.category || 'General',
      image: course.thumbnail?.url || course.image || 'https://via.placeholder.com/400x225',
      videoUrl: course.previewVideo || course.videoUrl || '',
      isBestseller: course.isBestseller || course.isPopular || false,
      isNew: course.isNew || false,
      isPro: course.isPro || false,
      tags: course.tags || [],
      description: course.shortDescription || course.description || '',
      slug: course.slug || course._id
    };
  };

  const formattedCourses = courses.map(formatCourse);

  // Filter and sort courses
  const filteredCourses = formattedCourses.filter(course => {
    const matchesFilter = activeFilter === 'All Courses' || course.category === activeFilter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
    const matchesPrice = selectedPrices.length === 0 || selectedPrices.some(price => {
      const coursePrice = course.price;
      switch(price) {
        case 'Free': return coursePrice === 0;
        case '₹0 - ₹3,000': return coursePrice >= 0 && coursePrice <= 3000;
        case '₹3,000 - ₹5,000': return coursePrice > 3000 && coursePrice <= 5000;
        case '₹5,000+': return coursePrice > 5000;
        default: return true;
      }
    });
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.some(duration => {
      const courseDuration = parseInt(course.duration);
      switch(duration) {
        case '0-10 hours': return courseDuration >= 0 && courseDuration <= 10;
        case '10-20 hours': return courseDuration > 10 && courseDuration <= 20;
        case '20+ hours': return courseDuration > 20;
        default: return true;
      }
    });
    
    return matchesFilter && matchesSearch && matchesLevel && matchesPrice && matchesDuration;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch(sortBy) {
      case 'popular': return b.students - a.students;
      case 'rating': return b.rating - a.rating;
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + coursesPerPage);

  const toggleFavorite = (courseId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(courseId)) {
      newFavorites.delete(courseId);
    } else {
      newFavorites.add(courseId);
    }
    setFavorites(newFavorites);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Cleaner Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-24 sm:pt-28 pb-12 sm:pb-16"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-white font-medium">Courses</span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">50,000+ Students Enrolled</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight"
            >
              Professional Trading
              <span className="block text-yellow-400">Courses & Certifications</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed"
            >
              Learn from industry experts with our comprehensive, practical courses designed to help you succeed in stock market trading and investing.
            </motion.p>

            {/* Compact Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 sm:gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{courses.length}</div>
                  <div className="text-xs text-gray-400">Courses</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">50K+</div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">4.8★</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Elegant Promotional Banner */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-yellow-400/20">
              <div className="relative p-6 sm:p-8">
                <button
                  onClick={() => setShowPromo(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">LIMITED TIME</span>
                        <span className="text-xs text-gray-400">Diwali Special Offer</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">
                        Save up to <span className="text-yellow-400">60% OFF</span>
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">on all premium courses</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/courses')}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 whitespace-nowrap"
                  >
                    Claim Offer <ArrowRight className="inline-block w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Layout with Sidebar */}
        <div className="flex gap-4 lg:gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${showSidebar ? 'w-72' : 'w-0'} flex-shrink-0 hidden lg:block transition-all duration-300`}
          >
            {showSidebar && (
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-yellow-400" />
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {builtCategories.map((category, index) => (
                      <motion.button
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        onClick={() => setActiveFilter(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          activeFilter === category.name
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-medium shadow-lg'
                            : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activeFilter === category.name
                            ? 'bg-gray-900/20'
                            : 'bg-gray-600/50'
                        }`}>
                          {category.count}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Popular Courses */}
                {popularCourses.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      Popular Courses
                    </h3>
                    <div className="space-y-4">
                      {popularCourses.map((course, index) => (
                        <motion.div
                          key={course}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            const courseObj = formattedCourses.find(c => c.title === course);
                            if (courseObj) {
                              navigate(`/courses/${courseObj.slug}`);
                            }
                          }}
                          className="flex items-start gap-2 text-sm text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{course}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRO Badge */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-2xl p-8 border border-purple-400/30 cursor-pointer shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-400/20 rounded-full blur-xl" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Crown className="w-6 h-6 text-yellow-300" />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white">iStockly PRO</span>
                        <p className="text-xs text-purple-100">Premium Membership</p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-50 mb-6 leading-relaxed">
                      Get unlimited access to all courses, exclusive content, and priority support
                    </p>
                    <button className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
                      Upgrade Now
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
                    {activeFilter === 'All Courses' ? 'All Courses' : activeFilter}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{sortedCourses.length} Courses</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>Expert-led training</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>Certificate of completion</span>
                  </div>
                </div>
                
                {/* View Mode Toggle - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2 mt-4 lg:mt-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-yellow-400 text-black shadow-lg' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-yellow-400 text-black shadow-lg' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for courses, topics, or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-gray-800/80 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-5 py-4 rounded-xl transition-all text-sm font-medium ${
                      showFilters 
                        ? 'bg-yellow-400 text-black shadow-lg' 
                        : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </motion.button>
                  
                  <div className="relative min-w-[140px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-4 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Top Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Level
                        </h3>
                        <div className="space-y-2">
                          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <label key={level} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={selectedLevels.includes(level)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLevels([...selectedLevels, level]);
                                  } else {
                                    setSelectedLevels(selectedLevels.filter(l => l !== level));
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-600 text-yellow-400 focus:ring-yellow-500 bg-gray-700" 
                              />
                              <span className="text-sm">{level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Price Range
                        </h3>
                        <div className="space-y-2">
                          {['Free', '₹0 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000+'].map((price) => (
                            <label key={price} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={selectedPrices.includes(price)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPrices([...selectedPrices, price]);
                                  } else {
                                    setSelectedPrices(selectedPrices.filter(p => p !== price));
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-600 text-yellow-400 focus:ring-yellow-500 bg-gray-700" 
                              />
                              <span className="text-sm">{price}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          Duration
                        </h3>
                        <div className="space-y-2">
                          {['0-10 hours', '10-20 hours', '20+ hours'].map((duration) => (
                            <label key={duration} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={selectedDurations.includes(duration)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDurations([...selectedDurations, duration]);
                                  } else {
                                    setSelectedDurations(selectedDurations.filter(d => d !== duration));
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-600 text-yellow-400 focus:ring-yellow-500 bg-gray-700" 
                              />
                              <span className="text-sm">{duration}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Course Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 sm:gap-8 mb-8 sm:mb-12 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {paginatedCourses.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <div className="text-2xl font-semibold text-white mb-2">No courses found</div>
                  <div className="text-gray-400 mb-6">Try adjusting filters or search terms.</div>
                  <button
                    onClick={() => { 
                      setSearchTerm(''); 
                      setSelectedLevels([]); 
                      setSelectedPrices([]); 
                      setSelectedDurations([]); 
                      setActiveFilter('All Courses'); 
                    }}
                    className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {paginatedCourses.map(course => (
                    <motion.div
                      key={course.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover="hover"
                      layout
                      className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-yellow-400/10"
                    >
                      {/* Image Section */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          loading="lazy"
                          className="w-full h-44 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {course.isBestseller && (
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                              BESTSELLER
                            </span>
                          )}
                          {course.isNew && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                              NEW
                            </span>
                          )}
                          {course.isPro && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                              <Crown className="w-3 h-3" />
                              PRO
                            </span>
                          )}
                        </div>
                        
                        {/* Play Overlay */}
                        {course.videoUrl && (
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                            <motion.a
                              href={course.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ scale: 0.8 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 rounded-xl text-black text-sm font-bold shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              Watch Preview
                            </motion.a>
                          </div>
                        )}
                        
                        {/* Rating Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-bold text-sm">{course.rating}</span>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6">
                        {/* Title */}
                        <Link to={`/courses/${course.slug}`}>
                          <h3 className="text-base sm:text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-snug min-h-[56px]">
                            {course.title}
                          </h3>
                        </Link>
                        
                        {/* Instructor */}
                        <p className="text-sm text-gray-400 mb-5 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
                            {course.instructor.split(' ')[0].charAt(0)}
                          </div>
                          <span>{course.instructor}</span>
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700/50">
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{(course.students / 1000).toFixed(1)}K</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                            {course.level}
                          </div>
                        </div>
                        
                        {/* Price & Button */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-yellow-400">
                                {formatCurrency(course.price)}
                              </span>
                              {course.originalPrice > course.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(course.originalPrice)}
                                </span>
                              )}
                            </div>
                            {course.discount > 0 && (
                              <span className="text-xs text-green-400 font-medium">
                                {course.discount}% OFF
                              </span>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/courses/${course.slug}`)}
                            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-xl"
                          >
                            Enroll Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-1.5 sm:gap-2 mb-8 sm:mb-12"
              >
                <motion.button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                      currentPage === page
                        ? 'bg-yellow-400 text-gray-900 font-medium'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8"
            >
              Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, sortedCourses.length)} of {sortedCourses.length} courses
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
