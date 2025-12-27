import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Users, 
  Smartphone, 
  BarChart3,
  Target,
  Zap,
  Award
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert Courses',
      description: 'Learn from industry experts with comprehensive courses covering all aspects of trading and investing.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Get real-time market insights and analysis to make informed investment decisions.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security ensures your investments and personal data are always protected.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a thriving community of traders and investors sharing knowledge and strategies.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile Trading',
      description: 'Trade on the go with our intuitive mobile app, available for iOS and Android.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: BarChart3,
      title: 'Advanced Tools',
      description: 'Access professional-grade trading tools and analytics for better decision making.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and track your financial goals with our intelligent progress monitoring system.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute trades instantly with our high-speed trading infrastructure.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Award,
      title: 'Certified Learning',
      description: 'Earn certificates and badges as you complete courses and achieve milestones.',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <section id="services" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
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
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="text-yellow-400">Succeed</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools, knowledge, and support 
            you need to master the financial markets and achieve your investment goals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                  }}
                  className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-xl mb-6 group-hover:bg-yellow-400/20 transition-colors duration-300"
                >
                  <feature.icon className="w-8 h-8 text-yellow-400" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
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
            Start Your Journey
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

export default Features;
