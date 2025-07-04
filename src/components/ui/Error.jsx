import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-error" 
        />
      </div>
      
      <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h2>
      
      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-primary bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" size={20} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;