import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Patel',
      role: 'Business Analyst',
      company: 'FinanceCorp',
      image: 'https://ui-avatars.com/api/?name=Priya+Patel&background=EAB308&color=000&size=60&bold=true',
      rating: 5,
      text: "The classroom program at iStockly is outstanding..."
    },
    {
      id: 2,
      name: 'Amit Kumar',
      role: 'Investment Manager',
      company: 'WealthMax',
      image: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=3B82F6&color=fff&size=60&bold=true',
      rating: 5,
      text: "I've tried many online platforms, but iStockly stands out..."
    },
    {
      id: 3,
      name: 'Sneha Gupta',
      role: 'Entrepreneur',
      company: 'StartupHub',
      image: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=10B981&color=fff&size=60&bold=true',
      rating: 5,
      text: "The mentorship program connected me with industry veterans..."
    },
    {
      id: 4,
      name: 'Vikash Singh',
      role: 'Chartered Accountant',
      company: 'CA Firm',
      image: 'https://ui-avatars.com/api/?name=Vikash+Singh&background=8B5CF6&color=fff&size=60&bold=true',
      rating: 5,
      text: "iStockly's approach to teaching investment strategies is methodical and practical..."
    },
  ];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium mb-6"
          >
            <Quote className="w-4 h-4 mr-2" />
            Student Success Stories
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            What Our <span className="text-yellow-400">Students</span> Say
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of successful traders and investors who have transformed their financial journey with iStockly
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Quote Icon */}
                <div className="relative z-10 mb-4">
                  <Quote className="w-8 h-8 text-yellow-400/50" />
                </div>

                {/* Rating */}
                <div className="relative z-10 flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <div className="relative z-10 mb-6">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-700 group-hover:border-yellow-400/50 transition-colors duration-300"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs">{testimonial.role}</div>
                    <div className="text-yellow-400 text-xs font-medium">{testimonial.company}</div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl blur-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 shadow-lg"
          >
            Join Our Community
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;










