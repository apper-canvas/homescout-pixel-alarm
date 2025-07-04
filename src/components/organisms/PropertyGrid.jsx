import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/molecules/PropertyCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onFavorite, 
  onRetry,
  onClearFilters 
}) => {
  if (loading) {
    return <Loading type="property-grid" />;
  }
  
  if (error) {
    return (
      <Error 
        title="Unable to load properties"
        message={error}
        onRetry={onRetry}
      />
    );
  }
  
  if (!properties || properties.length === 0) {
    return (
      <Empty 
        title="No properties found"
        message="Try adjusting your search criteria or filters to find more properties."
        actionLabel="Clear Filters"
        onAction={onClearFilters}
        icon="Home"
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PropertyCard 
            property={property}
            onFavorite={onFavorite}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyGrid;