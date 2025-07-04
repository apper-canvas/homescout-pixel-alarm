import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Empty from '@/components/ui/Empty';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { propertyService } from '@/services/api/propertyService';

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { savedProperties, toggleFavorite, clearAllFavorites } = useSavedProperties();
  
  useEffect(() => {
    loadSavedProperties();
  }, [savedProperties]);
  
  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (savedProperties.length === 0) {
        setProperties([]);
        return;
      }
      
      const allProperties = await propertyService.getAll();
      const saved = allProperties.filter(p => savedProperties.some(sp => sp.Id === p.Id));
      setProperties(saved);
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearAll = () => {
    clearAllFavorites();
  };
  
  if (!loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Saved Properties
          </h1>
          <p className="text-gray-600">
            Your favorite properties will appear here
          </p>
        </motion.div>
        
        <Empty
          title="No saved properties yet"
          message="Start browsing properties and click the heart icon to save your favorites here."
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/'}
          icon="Heart"
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Saved Properties
            </h1>
            <p className="text-gray-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          {properties.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleClearAll}
                icon="Trash2"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
              <Button
                onClick={() => window.location.href = '/compare'}
                icon="BarChart3"
                disabled={properties.length < 2}
              >
                Compare ({properties.length})
              </Button>
            </div>
          )}
        </div>
      </motion.div>
      
      <PropertyGrid
        properties={properties}
        loading={loading}
        error={error}
        onFavorite={toggleFavorite}
        onRetry={loadSavedProperties}
      />
    </div>
  );
};

export default SavedPropertiesPage;