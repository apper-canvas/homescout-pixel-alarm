import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { propertyService } from '@/services/api/propertyService';

const NeighborhoodStats = ({ propertyId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNeighborhoodStats();
  }, [propertyId]);

  const loadNeighborhoodStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getNeighborhoodStats(propertyId);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load neighborhood statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading type="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title="Unable to load neighborhood data"
        message={error}
        onRetry={loadNeighborhoodStats}
        showRetry={true}
      />
    );
  }

  if (!stats) {
    return null;
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" size={14} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Schools Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <ApperIcon name="GraduationCap" size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Nearby Schools</h3>
        </div>
        
        <div className="space-y-3">
          {stats.schools.map((school, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-900 text-sm">{school.name}</h4>
                <span className="text-xs text-gray-500">{school.distance}mi</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  {renderStars(school.rating)}
                </div>
                <span className="text-xs text-gray-600">{school.rating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600 font-medium">{school.type}</span>
                <span className="text-xs text-gray-500">{school.grades}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <ApperIcon name="Train" size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Transit Options</h3>
        </div>
        
        <div className="space-y-3">
          {stats.transit.map((transit, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon 
                  name={transit.type === 'Bus' ? 'Bus' : 'Train'} 
                  size={16} 
                  className="text-green-600" 
                />
                <span className="font-medium text-gray-900 text-sm">{transit.route}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-600">{transit.walkTime} min walk</span>
                </div>
                <span className="text-xs text-green-600 font-medium">{transit.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Amenities Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <ApperIcon name="MapPin" size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Local Amenities</h3>
        </div>
        
        <div className="space-y-3">
          {stats.amenities.map((amenity, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <ApperIcon name={amenity.icon} size={14} className="text-purple-600" />
                <span className="font-medium text-gray-900 text-sm">{amenity.name}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1">
                  {renderStars(amenity.rating)}
                </div>
                <span className="text-xs text-gray-500">{amenity.distance}mi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600 font-medium">{amenity.category}</span>
                <span className="text-xs text-gray-600">{amenity.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NeighborhoodStats;