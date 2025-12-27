import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, BookOpenCheck, TrendingUp, ShieldCheck, Award, Video, 
  GraduationCap, Wallet, PiggyBank, Shield, Coins, FileText, Sparkles, 
  Users, Star, Clock, ChevronLeft, ChevronRight, Heart, Share2, Crown,
  BarChart3, Target, Brain, Timer, Zap
} from 'lucide-react';
import { coursesAPI } from '../utils/api';
import { formatCurrency } from '../lib/utils';

const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll({ limit: 20, published: true });
      setCourses(response.data.courses || response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Trending', 'Options Trading', 'Technical Analysis', 'Investing', 'Beginners', 'in Hindi', 'Crypto'
  ];

  // Filter courses based on active category
  const getFilteredCourses = () => {
    if (activeCategory === 'Trending') {
      return courses.slice(0, 6);
    }
    return courses.filter(course => {
      const categoryLower = activeCategory.toLowerCase();
      const title = (course.title || '').toLowerCase();
      const category = (course.category || '').toLowerCase();
      return title.includes(categoryLower) || category.includes(categoryLower);
    }).slice(0, 6);
  };

  const featuredCourses = getFilteredCourses();

  const courseCategories = [
    {
      title: "Stock Market Basics",
      description: "Understand stock market concepts, key terms, and essential strategies.",
      icon: "📊",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Technical Analysis",
      description: "Learn chart patterns, indicators, and technical trading strategies.",
      icon: "📈",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Option Trading",
      description: "Master options strategies, Greeks, and advanced trading techniques.",
      icon: "⚡",
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Trading Strategies",
      description: "Discover proven trading methods and risk management techniques.",
      icon: "🎯",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Stock Market in Hindi",
      description: "Learn trading and investing concepts in Hindi language.",
      icon: "🇮🇳",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Crypto",
      description: "Explore cryptocurrency trading and blockchain investment strategies.",
      icon: "₿",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      title: "Stock Market Investing",
      description: "Build long-term wealth through smart investment strategies.",
      icon: "💰",
      color: "from-green-600 to-green-800"
    },
    {
      title: "Finance Certification",
      description: "Prepare for NISM and other financial certification exams.",
      icon: "🎓",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredCourses.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredCourses.length / 3)) % Math.ceil(featuredCourses.length / 3));
  };

  // Helper function to format course data
  const formatCourse = (course) => {
    return {
      id: course._id || course.id,
      title: course.title || 'Untitled Course',
      instructor: course.instructor || 'Expert Instructor',
      rating: course.rating || 4.5,
      students: course.totalEnrollments || course.enrollments || 0,
      duration: course.duration || '10 hours',
      level: course.level || 'Beginner',
      price: course.discountedPrice || course.price || 0,
      originalPrice: course.price || 0,
      discount: course.discountedPrice && course.price ? 
        Math.round(((course.price - course.discountedPrice) / course.price) * 100) + '%' : '0%',
      category: course.category || 'General',
      image: course.thumbnail?.url || course.image || 'https://via.placeholder.com/400x225',
      videoUrl: course.previewVideo || course.videoUrl || '',
      tags: course.tags || [],
      isBestseller: course.isBestseller || course.isPopular || false,
      isNew: course.isNew || false,
      isPro: course.isPro || false,
      slug: course.slug || course._id
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg"
        />
        <motion.div
          animate={{ x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-40 h-40 bg-yellow-400/5 rounded-full blur-2xl"
        />
      </div>

      {/* Modern Animated Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-40 overflow-hidden mt-16"
      >
        {/* Gradient Background with Animation */}
        <motion.div 
          className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        >
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-purple-400/20 animate-pulse" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${(i * 12) + 5}%`,
                  top: '50%',
                }}
                animate={{
                  y: [-10, -25, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Scrolling Text Content */}
          <div className="relative py-2 sm:py-3 px-2 sm:px-4">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex items-center gap-8 whitespace-nowrap"
            >
              {/* Duplicate content for seamless loop */}
              {[1, 2].map((set) => (
                <div key={set} className="flex items-center gap-4 sm:gap-6 text-white text-xs sm:text-sm font-medium">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/30"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                    <span className="text-yellow-300 font-bold text-xs sm:text-base">DIWALI & CHATH OFFER upto 60%</span>
                  </motion.div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-300" />
                    <span className="text-white font-semibold">Limited Time Offer</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
                    <span>All Courses Included</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <span>Expert Mentorship</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
                    <span>Lifetime Access</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-yellow-300" />
                    <span className="text-white font-semibold">24/7 Support</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Shine Effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
          {/* Left - Hero */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium backdrop-blur-sm"
            >
              <Play className="w-4 h-4 mr-2" />Learn. Trade. Invest. — All in One Platform.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              Stock market courses for everyone
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl"
            >
              Choose from a wide range of stock market courses on trading and investing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/courses")}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 text-black text-sm sm:text-base font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50"
              >
                Explore Courses <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/investment")}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border-2 border-gray-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-400/5 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Investments <BookOpenCheck className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 text-yellow-400 text-xs sm:text-sm mt-2"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-center sm:text-left">Trusted by 35,000+ learners • Government Recognized Startup</span>
            </motion.div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-8 border border-gray-700/50 shadow-2xl backdrop-blur-xl"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium mb-4 px-3 py-1 bg-yellow-400/10 rounded-full">
                    <Award className="w-4 h-4" />
                    Learning Excellence
                  </div>
                  <div className="text-white text-4xl font-bold mb-2">50,000+</div>
                  <div className="text-gray-400 text-sm mb-6">Students Trained</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-white text-xl font-bold">4.9★</div>
                      <div className="text-gray-400 text-xs">Rating</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <div className="text-white text-xl font-bold">300%</div>
                      <div className="text-gray-400 text-xs">Growth</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-6 -right-6 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-yellow-400/50"
              >
                Top Rated
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg shadow-green-500/50"
              >
                Expert Guidance
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-3xl transform scale-110" />
          </motion.div>
        </div>

        {/* Course Categories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Find courses by category</h2>
              <p className="text-sm sm:text-base text-gray-400">Choose a course based on your stock market interests.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/courses")}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 text-sm sm:text-base self-start sm:self-auto"
            >
              View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleNavigation('/courses')}
                className="group bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-white text-sm sm:text-base font-semibold mb-1 sm:mb-2 group-hover:text-yellow-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Courses Section */}
        {featuredCourses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Featured Courses</h2>
                <p className="text-sm sm:text-base text-gray-400">Handpicked courses by our expert instructors</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/courses")}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 text-sm sm:text-base self-start sm:self-auto"
              >
                View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-base ${
                    activeCategory === category
                      ? 'bg-black text-white font-medium shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Course Cards - Modern Grid Layout */}
            <div className="relative">
              {/* Mobile: Scrollable Grid, Desktop: Carousel */}
              <div className="sm:overflow-hidden">
                <motion.div
                  animate={{ x: isMobile ? 0 : -currentSlide * 100 + '%' }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:flex gap-6 sm:gap-8"
                >
                  {Array.from({ length: Math.ceil(featuredCourses.length / 3) }, (_, slideIndex) => (
                    <div key={slideIndex} className="contents sm:flex sm:gap-6 sm:min-w-full">
                      {featuredCourses.slice(slideIndex * 3, (slideIndex + 1) * 3).map((course, index) => {
                        const formattedCourse = formatCourse(course);
                        return (
                          <motion.div
                            key={formattedCourse.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="flex-1 bg-gray-800/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-400/60 transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-yellow-400/10"
                          >
                            <div className="relative overflow-hidden">
                              <img 
                                src={formattedCourse.image} 
                                alt={formattedCourse.title} 
                                loading="lazy"
                                className="w-full h-52 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                              />
                              
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                              
                              {/* Overlay Badges */}
                              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {formattedCourse.isBestseller && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                                  >
                                    Bestseller
                                  </motion.span>
                                )}
                                {formattedCourse.isNew && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                                  >
                                    New
                                  </motion.span>
                                )}
                                {formattedCourse.isPro && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm"
                                  >
                                    <Crown className="w-3 h-3" />
                                    PRO
                                  </motion.span>
                                )}
                              </div>
                              
                              {/* Play Button Overlay */}
                              {formattedCourse.videoUrl && (
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                  <motion.a
                                    href={formattedCourse.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ scale: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={`Watch preview for ${formattedCourse.title}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 rounded-xl text-black font-bold hover:bg-yellow-300 transition-all shadow-lg"
                                  >
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Preview
                                  </motion.a>
                                </div>
                              )}
                              
                              {/* Rating Badge on Image */}
                              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-white font-bold text-sm">{formattedCourse.rating}</span>
                              </div>
                            </div>
                            
                            <div className="p-5 sm:p-6">
                              {/* Title */}
                              <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                                {formattedCourse.title}
                              </h3>
                              
                              {/* Instructor with Avatar */}
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
                                  {formattedCourse.instructor.split(' ')[0].charAt(0)}
                                </div>
                                <span className="text-sm text-gray-400">{formattedCourse.instructor}</span>
                              </div>
                              
                              {/* Students Count */}
                              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                <Users className="w-4 h-4" />
                                <span>{formattedCourse.students.toLocaleString()} students</span>
                              </div>
                              
                              {/* Meta Info */}
                              <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-700/50">
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>{formattedCourse.duration}</span>
                                </div>
                                <div className="text-xs px-2.5 py-1 bg-gray-700/50 rounded-full text-gray-300">
                                  {formattedCourse.level}
                                </div>
                              </div>
                              
                              {/* Price & Action */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl font-bold text-yellow-400">
                                      {formatCurrency(formattedCourse.price)}
                                    </span>
                                    {formattedCourse.originalPrice > formattedCourse.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatCurrency(formattedCourse.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                  {formattedCourse.discount !== '0%' && (
                                    <span className="text-xs text-green-400 font-medium">
                                      {formattedCourse.discount} OFF
                                    </span>
                                  )}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleNavigation(`/courses/${formattedCourse.slug}`)}
                                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl text-black text-sm font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-xl"
                                >
                                  Enroll Now
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Modern Navigation Arrows - Hidden on mobile */}
              {featuredCourses.length > 3 && (
                <>
                  <motion.button
                    onClick={prevSlide}
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-full p-3 text-white hover:bg-gray-700 hover:border-yellow-400/50 transition-all shadow-xl items-center justify-center"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  
                  <motion.button
                    onClick={nextSlide}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-full p-3 text-white hover:bg-gray-700 hover:border-yellow-400/50 transition-all shadow-xl items-center justify-center"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {[
            { label: 'Active Users', value: '50K+', icon: Users },
            { label: 'Growth Rate', value: '300%', icon: TrendingUp },
            { label: 'Awards Won', value: '25+', icon: Award }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400/10 rounded-full mb-2 sm:mb-3 group-hover:bg-yellow-400/20 transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Investment Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Smart Investing, Simplified.</h2>
            <p className="text-gray-400">All your investments under one platform — guided by AI.</p>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Wallet, title: "Wealth Management", desc: "Personalized strategies" },
              { icon: TrendingUp, title: "Mutual Funds", desc: "Diversified portfolios" },
              { icon: Coins, title: "ETFs", desc: "Exchange-traded funds" },
              { icon: PiggyBank, title: "Digital Gold", desc: "Invest in 24K gold" },
              { icon: FileText, title: "Fixed Deposits", desc: "Secure FD investments" },
              { icon: Shield, title: "Insurance", desc: "Life & health coverage" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleNavigation('/investment')}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-yellow-400/50 shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                      <Icon className="text-yellow-400 w-5 h-5" />
                    </div>
                    <div className="font-semibold text-white">{item.title}</div>
                  </div>
                  <div className="text-gray-400 text-sm">{item.desc}</div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/investment")}
              className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50"
            >
              Start Investing Today →
            </motion.button>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 mb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-2xl p-12 backdrop-blur-xl text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your journey from learning to investing starts here.
              </h2>
              <p className="text-xl text-gray-300 mb-8 flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                Join 35,000+ Learners
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/courses")}
                className="inline-flex items-center px-10 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50"
              >
                Get Started Today <ArrowRight className="ml-2 w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
