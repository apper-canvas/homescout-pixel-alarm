import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { formatPrice } from '@/utils/formatters';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen, 
  onClose 
}) => {
  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse'];
  
  const handleRangeChange = (field, value) => {
    onFilterChange({ ...filters, [field]: parseInt(value) });
  };
  
  const handleCheckboxChange = (field, value, checked) => {
    const currentValues = filters[field] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    onFilterChange({ ...filters, [field]: newValues });
  };
  
  const filterContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Min Price: {formatPrice(filters.priceMin || 0)}
            </label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={filters.priceMin || 0}
              onChange={(e) => handleRangeChange('priceMin', e.target.value)}
              className="range-slider w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Max Price: {formatPrice(filters.priceMax || 2000000)}
            </label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={filters.priceMax || 2000000}
              onChange={(e) => handleRangeChange('priceMax', e.target.value)}
              className="range-slider w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Property Type */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Property Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) || false}
                onChange={(e) => handleCheckboxChange('propertyTypes', type, e.target.checked)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Bedrooms */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">
          Min Bedrooms: {filters.bedroomsMin || 0}
        </h3>
        <input
          type="range"
          min="0"
          max="6"
          value={filters.bedroomsMin || 0}
          onChange={(e) => handleRangeChange('bedroomsMin', e.target.value)}
          className="range-slider w-full"
        />
      </div>
      
      {/* Bathrooms */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">
          Min Bathrooms: {filters.bathroomsMin || 0}
        </h3>
        <input
          type="range"
          min="0"
          max="4"
          step="0.5"
          value={filters.bathroomsMin || 0}
          onChange={(e) => handleRangeChange('bathroomsMin', e.target.value)}
          className="range-slider w-full"
        />
      </div>
      
      {/* Square Feet */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">
          Min Square Feet: {(filters.squareFeetMin || 0).toLocaleString()}
        </h3>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={filters.squareFeetMin || 0}
          onChange={(e) => handleRangeChange('squareFeetMin', e.target.value)}
          className="range-slider w-full"
        />
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        {isOpen && (
          <Button 
            onClick={onClose}
            className="flex-1"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );
  
  if (isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          className="bg-white h-full w-80 max-w-[90vw] p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Filters</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          {filterContent}
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-display font-semibold mb-6">Filters</h2>
      {filterContent}
    </div>
  );
};

export default FilterPanel;