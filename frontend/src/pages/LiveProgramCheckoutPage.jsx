// frontend/src/pages/LiveProgramCheckoutPage.jsx
// Checkout page for live programs

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Calendar, Clock, Video } from 'lucide-react';
import { liveProgramsAPI, paymentAPI, setAuthToken } from '../utils/api';
import { formatCurrency, isValidPhone, formatDate } from '../lib/utils';

const LiveProgramCheckoutPage = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProgram();
    if (user) {
      prefillUserData();
    }
  }, [slug, user]);

  const fetchProgram = async () => {
    try {
      const response = await liveProgramsAPI.getBySlug(slug);
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
      alert('Program not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const prefillUserData = () => {
    setFormData(prev => ({
      ...prev,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.primaryEmailAddress?.emailAddress || '',
      phone: user.phoneNumbers?.[0]?.phoneNumber || '',
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    try {
      setProcessing(true);
      const token = await getToken();
      setAuthToken(token);

      const paymentData = {
        programId: program._id,
        amount: program.discountedPrice || program.price,
        userEmail: formData.email,
        userName: `${formData.firstName} ${formData.lastName}`,
        userPhone: formData.phone.replace(/\D/g, ''),
        userAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        programType: program.type
      };

      // You'll need to create a separate payment initiation endpoint for live programs
      const response = await paymentAPI.initiate(paymentData);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.error || 'Payment initiation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  const finalPrice = program.discountedPrice || program.price;
  const hasDiscount = program.discountedPrice && program.discountedPrice < program.price;

  const getTypeLabel = (type) => {
    const labels = {
      webinar: 'Webinar',
      mentorship: 'Mentorship Program',
      workshop: 'Workshop',
      guidance: '1:1 Guidance'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Program</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                          errors.firstName ? 'border-red-500' : 'border-zinc-800'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                          errors.lastName ? 'border-red-500' : 'border-zinc-800'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                        errors.email ? 'border-red-500' : 'border-zinc-800'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                        errors.phone ? 'border-red-500' : 'border-zinc-800'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold text-white mb-4">Billing Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House No., Street Name"
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                          errors.address ? 'border-red-500' : 'border-zinc-800'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                            errors.city ? 'border-red-500' : 'border-zinc-800'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                            errors.state ? 'border-red-500' : 'border-zinc-800'
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-yellow-500 ${
                          errors.pincode ? 'border-red-500' : 'border-zinc-800'
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{processing ? 'Processing...' : 'Proceed to Payment'}</span>
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

                {program.thumbnail?.url && (
                  <img
                    src={program.thumbnail.url}
                    alt={program.title}
                    className="w-full aspect-video object-cover rounded-lg mb-4"
                  />
                )}

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm font-medium mb-2">
                    {getTypeLabel(program.type)}
                  </span>
                </div>

                <h3 className="font-semibold text-white mb-2">{program.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{program.instructor}</p>

                {/* Session Details */}
                <div className="space-y-2 mb-4 pb-4 border-b border-zinc-800">
                  {program.sessionDate && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                      {formatDate(program.sessionDate)}
                    </div>
                  )}
                  {program.sessionTime && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                      {program.sessionTime}
                    </div>
                  )}
                  {program.duration && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                      {program.duration}
                    </div>
                  )}
                  {program.mode && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Video className="w-4 h-4 mr-2 text-yellow-400" />
                      {program.mode.charAt(0).toUpperCase() + program.mode.slice(1)} Mode
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Original Price</span>
                    <span>{formatCurrency(program.price)}</span>
                  </div>
                  
                  {hasDiscount && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>- {formatCurrency(program.price - program.discountedPrice)}</span>
                    </div>
                  )}

                  <div className="border-t border-zinc-800 pt-3 flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span className="flex items-center">
                      <span className="text-yellow-400">{formatCurrency(finalPrice)}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveProgramCheckoutPage;