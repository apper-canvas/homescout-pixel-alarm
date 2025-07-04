import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { formatPrice } from '@/utils/formatters';

const PropertyCard = ({ property, onFavorite, className = '' }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavorite(property.Id);
  };
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`property-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="property-image w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-4 left-4">
          <div className="price-badge">
            {formatPrice(property.price)}
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <ApperIcon 
            name={property.isFavorite ? "Heart" : "Heart"} 
            size={20} 
            className={property.isFavorite ? "text-accent fill-current" : "text-gray-400"} 
          />
        </button>
        <Badge 
          variant="primary" 
          className="absolute bottom-4 left-4"
        >
          {property.propertyType}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          <span className="text-sm">{property.city}, {property.state}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ApperIcon name="Bed" size={16} />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Bath" size={16} />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Square" size={16} />
              <span>{property.squareFeet.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;