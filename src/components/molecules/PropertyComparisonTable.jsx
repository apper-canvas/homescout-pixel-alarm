import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { formatPrice, formatLocation } from '@/utils/formatters';

const PropertyComparisonTable = ({ properties, onViewDetails }) => {
  const ComparisonRow = ({ label, icon, values, highlight = false }) => (
    <div className={`grid grid-cols-4 gap-4 py-4 border-b border-gray-100 ${highlight ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <ApperIcon name={icon} size={16} className="text-primary" />
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex items-center justify-center">
          <span className={`text-center ${highlight ? 'font-semibold text-primary' : 'text-gray-900'}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );

  const PropertyHeader = ({ property, index }) => (
    <div className="text-center">
      <div className="relative mb-4">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="primary">{property.propertyType}</Badge>
        </div>
      </div>
      <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
        {property.title}
      </h3>
      <p className="text-gray-600 text-sm mb-3">
        {formatLocation(property.city, property.state)}
      </p>
      <div className="text-2xl font-bold text-primary mb-4">
        {formatPrice(property.price)}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-display font-semibold mb-6 text-center">
          Property Comparison
        </h2>
        
        {/* Property Headers */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div></div> {/* Empty cell for row labels */}
          {properties.map((property, index) => (
            <PropertyHeader key={property.Id} property={property} index={index} />
          ))}
        </div>

        {/* Comparison Rows */}
        <div className="space-y-2">
          <ComparisonRow
            label="Price"
            icon="DollarSign"
            values={properties.map(p => formatPrice(p.price))}
            highlight={true}
          />
          
          <ComparisonRow
            label="Bedrooms"
            icon="Bed"
            values={properties.map(p => p.bedrooms)}
          />
          
          <ComparisonRow
            label="Bathrooms"
            icon="Bath"
            values={properties.map(p => p.bathrooms)}
          />
          
          <ComparisonRow
            label="Square Feet"
            icon="Square"
            values={properties.map(p => p.squareFeet.toLocaleString())}
          />
          
          <ComparisonRow
            label="Year Built"
            icon="Calendar"
            values={properties.map(p => p.yearBuilt)}
          />
          
          <ComparisonRow
            label="Price/Sq Ft"
            icon="Calculator"
            values={properties.map(p => formatPrice(Math.round(p.price / p.squareFeet)))}
            highlight={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div></div> {/* Empty cell for alignment */}
          {properties.map(property => (
            <Button
              key={property.Id}
              onClick={() => onViewDetails && onViewDetails(property.Id)}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="Eye" size={16} className="mr-2" />
              View Details
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyComparisonTable;