import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "What is iStockly and how does it work?",
      answer: "iStockly is a comprehensive financial education platform that offers courses, mentorship, and investment tools. We provide expert-led training in stock market investing, mutual funds, digital gold, and more. Our platform combines theoretical knowledge with practical application to help you make informed investment decisions."
    },
    {
      id: 2,
      question: "Are the courses suitable for beginners?",
      answer: "Absolutely! Our courses are designed for all skill levels. We start with basic concepts and gradually progress to advanced strategies. Our 'Basic to Advance' and 'Beginners to Pro' courses are specifically tailored for newcomers to the investment world."
    },
    {
      id: 4,
      question: "How does the mentorship program work?",
      answer: "Our mentorship program connects you with industry experts and successful traders. You get one-on-one guidance, personalized investment strategies, regular portfolio reviews, and direct access to mentors through scheduled sessions and community forums."
    },
    {
      id: 6,
      question: "Are the webinars live or recorded?",
      answer: "We offer both live and recorded webinars. Live webinars allow real-time interaction with experts and Q&A sessions. Recorded webinars are available 24/7 for your convenience, with new content added regularly based on market trends."
    },
    {
      id: 7,
      question: "How accurate is your AI Calculator?",
      answer: "Our AI Calculator uses advanced algorithms and real-time market data to provide highly accurate predictions and recommendations. It considers multiple factors including market trends, historical data, risk assessment, and your personal financial goals."
    },
    {
      id: 9,
      question: "What kind of support do you offer to students?",
      answer: "We provide comprehensive support including 24/7 customer service, dedicated doubt-solving sessions, community forums, regular market updates, and lifetime access to course materials. Our support team includes both technical and financial experts."
    },
    {
      id: 10,
      question: "How do I get started with iStockly?",
      answer: "Getting started is easy! Simply sign up for a free account, browse our course catalog, and choose the program that best fits your learning goals. You can start with our free introductory modules or jump into our comprehensive paid courses."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Got <span className="text-yellow-400">Questions?</span> We've Got Answers
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find answers to the most common questions about our platform, courses, and services
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden">
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200"
                  whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.3)" }}
                >
                  <span className="text-white font-semibold text-lg pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-yellow-400" />
                    )}
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-t border-gray-800">
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="text-gray-300 leading-relaxed pt-4"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you get started with your investment journey.
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 20px 40px rgba(250, 204, 21, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300"
            >
              Contact Support
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                →
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;










