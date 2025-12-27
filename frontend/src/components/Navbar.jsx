import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'ashubitmesra121@gmail.com';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [searchOpen]);

  // Sample search results
  const searchResults = [
    { title: "Options Trading Course", type: "Course", href: "/courses" },
    { title: "Technical Analysis", type: "Course", href: "/courses" },
    { title: "Mutual Funds Investment", type: "Investment", href: "/investment/mutual-funds" },
    { title: "Trading Strategies", type: "Course", href: "/courses" },
    { title: "Digital Gold", type: "Investment", href: "/investment/digital-gold" },
    { title: "Mentorship Program", type: "Live", href: "/live/mentorship" },
  ].filter(item => 
    searchQuery && item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { label: "Home", to: "/" },
    {
      label: "Courses",
      to: "/courses",
      dropdownType: "courses", // special dropdown type
    },
    { label: "Classroom Program", to: "/classroom" },
    {
      label: "Live",
      to: "/live",
      dropdownType: "live", // special dropdown type for Live section
    },
    { label: "Mentorship", to: "/mentorship" },
    {
      label: "Investment",
      to: "/investment",
      dropdown: [
        { label: "Mutual Funds", to: "/investment/mutual-funds" },
        { label: "Digital Gold", to: "/investment/digital-gold" },
        { label: "Fixed Deposits (FD)", to: "/investment/fixed-deposits" },
        { label: "Insurance", to: "/investment/insurance" },
        { label: "AI Calculator", to: "/investment/ai-calculator" },
      ],
    },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link to="/">
              <img
                src="https://customer-assets.emergentagent.com/job_ac864df3-eb5b-4916-8684-c83965266876/artifacts/6qtfk7h5_istockly%20Logo%20yellow.png"
                alt="iStockly"
                className="h-6 sm:h-8 w-auto"
              />
            </Link>
          </motion.div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6">
              {navItems.map((item, index) => (
                <div key={item.label} className="relative group">
                  {item.dropdown || item.dropdownType === "courses" || item.dropdownType === "live" ? (
                    <>
                      {/* Dropdown Button */}
                      <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        className="text-gray-300 hover:text-yellow-400 px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap"
                      >
                        {item.label}
                        <ChevronDown className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>

                      {/* Courses Dropdown */}
                      {item.dropdownType === "courses" ? (
                        <div className="absolute top-full left-0 mt-2 w-[90vw] max-w-3xl md:w-[800px] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Trending Courses */}
                          <div>
                            <h3 className="text-gray-400 text-sm font-medium mb-3">
                              TRENDING COURSES
                            </h3>
                            <ul className="space-y-2">
                              {[
                                "Passive Income through Options Selling",
                                "Price Action Strategy using CPR ",
                                "Intraday Trading Strategies ",
                                "Momentum Value Strategy",
                                "Trading Secrets ",
                              ].map((course) => (
                                <li
                                  key={course}
                                  className="text-gray-300 hover:text-yellow-400 text-sm transition-colors duration-200 cursor-pointer"
                                >
                                  {course}
                                </li>
                              ))}
                            </ul>
                            <Link
                              to="/courses"
                              className="mt-3 inline-block text-yellow-400 text-sm font-medium hover:underline"
                            >
                              View All Courses →
                            </Link>
                          </div>

                          {/* Top Categories */}
                          <div>
                            <h3 className="text-gray-400 text-sm font-medium mb-3">
                              TOP CATEGORIES
                            </h3>
                            <ul className="space-y-3">
                              {[
                                "Option Trading",
                                "Technical Analysis",
                                "Trading Strategies",
                                "Stock Market Investing",
                              ].map((category) => (
                                <li
                                  key={category}
                                  className="text-gray-300 hover:text-yellow-400 text-sm transition-colors duration-200 cursor-pointer flex items-center"
                                >
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                  {category}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Finance & Crypto */}
                          <div className="space-y-6">
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <span className="bg-green-600 text-xs text-white px-2 py-0.5 rounded-full">
                                New
                              </span>
                              <h4 className="mt-2 text-white font-medium">
                                Finance Certification Courses
                              </h4>
                              <p className="text-gray-400 text-sm">
                                Prepare for NISM and other finance
                                certification exams.
                              </p>
                              <Link
                                to="/finance-courses"
                                className="text-yellow-400 text-sm font-medium hover:underline"
                              >
                                See courses →
                              </Link>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <h4 className="text-white font-medium">
                                Crypto courses
                              </h4>
                              <p className="text-gray-400 text-sm">
                                Learn how to analyze, trade, and invest in
                                crypto.
                              </p>
                              <Link
                                to="/crypto-courses"
                                className="text-yellow-400 text-sm font-medium hover:underline"
                              >
                                See courses →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : item.dropdownType === "live" ? (
                        /* Live Dropdown */
                        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6">
                          <div className="space-y-4">
                            {/* 1:1 Guidance */}
                            <Link
                              to="/live/guidance"
                              className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-200 group"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors">
                                    1:1 Guidance
                                  </h3>
                                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                    Guidance calls with experts to discuss strategy, setups, risk management and more.
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {/* Webinars */}
                            <Link
                              to="/live/webinars"
                              className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-200 group"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors">
                                    Webinars
                                  </h3>
                                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                    Value packed interactive sessions led by expert traders
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {/* Mentorship */}
                            <Link
                              to="/live/mentorship"
                              className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-200 group"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors">
                                    Mentorship
                                  </h3>
                                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                    Join structured mentorship programs led by SEBI-certified mentors
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {/* Workshops */}
                            <Link
                              to="/live/workshops"
                              className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-yellow-500/30 transition-all duration-200 group"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors">
                                    Workshops
                                  </h3>
                                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                    Hands-on stock market & trading workshops in both online and offline modes
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        /* Regular Dropdown */
                        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.to}
                              className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Normal Nav Item */
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <Link
                        to={item.to}
                        className="text-gray-300 hover:text-yellow-400 px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap"
                      >
                        {item.label}
                        <motion.div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="text-gray-300 hover:text-yellow-400 p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              aria-label="Open search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-yellow-400 text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    Admin
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-yellow-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Toggle menu"
              aria-controls="primary-navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black/95 border-t border-gray-800"
            id="primary-navigation"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown || item.dropdownType ? (
                    <div>
                      <div className="flex items-center justify-between py-2 text-gray-300 font-medium">
                        <span>{item.label}</span>
                      </div>
                      {item.dropdown && (
                        <div className="pl-3 space-y-1">
                          {item.dropdown.map((sub) => (
                            <Link key={sub.label} to={sub.to} className="block py-1 text-sm text-gray-400 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                      {item.dropdownType === "live" && (
                        <div className="pl-3 space-y-1">
                          <Link to="/live/webinars" className="block py-1 text-sm text-gray-400 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                            Webinars
                          </Link>
                          <Link to="/live/mentorship" className="block py-1 text-sm text-gray-400 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                            Mentorship
                          </Link>
                          <Link to="/live/workshops" className="block py-1 text-sm text-gray-400 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                            Workshops
                          </Link>
                          <Link to="/live/guidance" className="block py-1 text-sm text-gray-400 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                            1:1 Guidance
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={item.to} className="block py-2 text-gray-300 hover:text-yellow-400" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {/* Auth - Mobile */}
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="inline-flex w-full items-center justify-center px-4 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center justify-center py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-6 border-b border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search courses, investments, mentors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={result.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={result.href}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                          >
                            <div>
                              <div className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                                {result.title}
                              </div>
                              <div className="text-sm text-gray-400">{result.type}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{searchQuery}"</p>
                    </div>
                  )
                ) : (
                  <div className="p-6">
                    <div className="text-gray-400 text-sm mb-4">Popular searches:</div>
                    <div className="space-y-2">
                      {["Options Trading", "Technical Analysis", "Mutual Funds", "Digital Gold", "Mentorship"].map((term, index) => (
                        <motion.button
                          key={term}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSearchQuery(term)}
                          className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-yellow-400 transition-colors"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
