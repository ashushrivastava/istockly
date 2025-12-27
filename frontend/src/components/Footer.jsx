// frontend/src/components/Footer.jsx
// Footer component

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">iS</span>
              </div>
              <span className="text-xl font-bold text-white">iStockly</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Empowering traders and investors with world-class education and mentorship in stock market and trading.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/ashukumar159/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ashukumar159/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ashukumar159/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ashukumar159/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/ashukumar159/" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Courses</Link></li>
              <li><Link to="/classroom" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Classroom</Link></li>
              <li><Link to="/webinars" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Webinars</Link></li>
              <li><Link to="/mentorship" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Mentorship</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
<div>
  <h3 className="text-white font-semibold mb-4">Support</h3>
  <ul className="space-y-2">
    <li><Link to="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">About Us</Link></li>
    <li><Link to="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Contact</Link></li>
    <li><Link to="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">FAQ</Link></li>
    <li><Link to="/cancellation-refund" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Cancellation & Refund</Link></li>
    <li><Link to="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Privacy Policy</Link></li>
    <li><Link to="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Terms & Conditions</Link></li>
  </ul>
</div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">support@istockly.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+91 1234567890</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Patna, Bihar, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Designed and Developed by <a href="https://www.linkedin.com/in/ashukumar159/" className="text-yellow-400 hover:text-yellow-500 transition-colors">Ashu Kumar</a> and <a href="https://www.linkedin.com/in/yashjha024/" className="text-yellow-400 hover:text-yellow-500 transition-colors">Yash Jha</a> and <a href="https://www.linkedin.com/in/piyush-prakhar169/" className="text-yellow-400 hover:text-yellow-500 transition-colors">Piyush Prakhar</a> </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;