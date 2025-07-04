import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { propertyService } from '@/services/api/propertyService';
import { formatPrice } from '@/utils/formatters';

const ComparePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const { savedProperties } = useSavedProperties();
  
  useEffect(() => {
    loadSavedProperties();
  }, [savedProperties]);
  
  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      
      if (savedProperties.length === 0) {
        setProperties([]);
        return;
      }
      
      const allProperties = await propertyService.getAll();
      const saved = allProperties.filter(p => savedProperties.some(sp => sp.Id === p.Id));
      setProperties(saved);
      
      // Auto-select first two properties
      if (saved.length >= 2) {
        setSelectedProperties(saved.slice(0, 2));
      }
    } catch (err) {
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePropertySelect = (property) => {
    if (selectedProperties.find(p => p.Id === property.Id)) {
      setSelectedProperties(selectedProperties.filter(p => p.Id !== property.Id));
    } else if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    } else {
      toast.warning('You can compare up to 3 properties at a time');
    }
  };
  
  const ComparisonAttribute = ({ label, values, icon }) => (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center gap-2 mb-2">
        <ApperIcon name={icon} size={18} className="text-primary" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {values.map((value, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
  
  if (loading) {
    return <Loading />;
  }
  
  if (properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Compare Properties
          </h1>
          <p className="text-gray-600">
            Compare your saved properties side by side
          </p>
        </motion.div>
        
        <Empty
          title="No saved properties to compare"
          message="Save at least 2 properties to start comparing them side by side."
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/'}
          icon="BarChart3"
        />
      </div>
    );
  }
  
  if (properties.length < 2) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Compare Properties
          </h1>
          <p className="text-gray-600">
            Compare your saved properties side by side
          </p>
        </motion.div>
        
        <Empty
          title="Need more properties to compare"
          message="Save at least 2 properties to start comparing them side by side."
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/'}
          icon="BarChart3"
        />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Compare Properties
        </h1>
        <p className="text-gray-600">
          Select up to 3 properties to compare side by side
        </p>
      </motion.div>
      
      {/* Property Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-display font-semibold mb-4">Select Properties to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(property => (
            <div
              key={property.Id}
              onClick={() => handlePropertySelect(property)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedProperties.find(p => p.Id === property.Id)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{property.city}, {property.state}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{formatPrice(property.price)}</span>
                {selectedProperties.find(p => p.Id === property.Id) && (
                  <ApperIcon name="Check" size={20} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Comparison Table */}
      {selectedProperties.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-display font-semibold mb-6">Property Comparison</h2>
          
          {/* Property Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedProperties.map(property => (
              <div key={property.Id} className="text-center">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-display font-semibold text-lg mb-1">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.city}, {property.state}</p>
                <Badge variant="primary">{property.propertyType}</Badge>
              </div>
            ))}
          </div>
          
          {/* Comparison Attributes */}
          <div className="space-y-4">
            <ComparisonAttribute
              label="Price"
              icon="DollarSign"
              values={selectedProperties.map(p => formatPrice(p.price))}
            />
            
            <ComparisonAttribute
              label="Bedrooms"
              icon="Bed"
              values={selectedProperties.map(p => p.bedrooms)}
            />
            
            <ComparisonAttribute
              label="Bathrooms"
              icon="Bath"
              values={selectedProperties.map(p => p.bathrooms)}
            />
            
            <ComparisonAttribute
              label="Square Feet"
              icon="Square"
              values={selectedProperties.map(p => p.squareFeet.toLocaleString())}
            />
            
            <ComparisonAttribute
              label="Year Built"
              icon="Calendar"
              values={selectedProperties.map(p => p.yearBuilt)}
            />
            
            <ComparisonAttribute
              label="Price per Sq Ft"
              icon="Calculator"
              values={selectedProperties.map(p => formatPrice(Math.round(p.price / p.squareFeet)))}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {selectedProperties.map(property => (
              <Button
                key={property.Id}
                onClick={() => window.location.href = `/property/${property.Id}`}
                variant="outline"
                className="flex-1"
              >
                View Details
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComparePage;