import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No properties found",
  message = "Try adjusting your search criteria or filters to find more properties.",
  actionLabel = "Clear Filters",
  onAction,
  icon = "Home"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          size={64} 
          className="text-primary" 
        />
      </div>
      
      <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h2>
      
      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="Filter" size={20} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;