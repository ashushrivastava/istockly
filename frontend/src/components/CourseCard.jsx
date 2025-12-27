// frontend/src/components/CourseCard.jsx
// Course card component for displaying course information

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const CourseCard = ({ course, index = 0 }) => {
  const {
    _id,
    title,
    slug,
    shortDescription,
    instructor,
    price,
    discountedPrice,
    duration,
    level,
    thumbnail,
    rating,
    totalEnrollments,
  } = course;

  const finalPrice = discountedPrice || price;
  const hasDiscount = discountedPrice && discountedPrice < price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 group"
    >
      <Link to={`/courses/${slug}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-zinc-800">
          {thumbnail?.url ? (
            <img
              src={thumbnail.url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          )}
          {level && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-full">
              {level}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {title}
          </h3>

          {shortDescription && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {shortDescription}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            {totalEnrollments > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{totalEnrollments} students</span>
              </div>
            )}
            {rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            )}
          </div>

          {instructor && (
            <p className="text-sm text-gray-500 mb-4">By {instructor}</p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex items-center space-x-2">
              {hasDiscount && (
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(price)}
                </span>
              )}
              <span className="text-2xl font-bold text-yellow-400 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {finalPrice}
              </span>
            </div>
            <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm">
              View Course
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;