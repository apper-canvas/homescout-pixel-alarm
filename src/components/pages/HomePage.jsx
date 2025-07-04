import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import PropertyMap from '@/components/organisms/PropertyMap';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useProperties } from '@/hooks/useProperties';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { useFilters } from '@/hooks/useFilters';
const HomePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { properties, loading, error, loadProperties } = useProperties();
  const { toggleFavorite } = useSavedProperties();
  const { filters, updateFilters, clearFilters, filteredProperties } = useFilters(properties);
  
  useEffect(() => {
    loadProperties();
  }, []);
  
  const handleSearch = (searchTerm) => {
    // In a real app, this would trigger a new API call
    console.log('Searching for:', searchTerm);
    loadProperties();
  };
  
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Apply sorting logic here
  };
  
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.listingDate) - new Date(a.listingDate);
      case 'oldest':
        return new Date(a.listingDate) - new Date(b.listingDate);
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover the perfect property with our comprehensive search and filtering tools
            </p>
          </motion.div>
          
          <SearchBar onSearch={handleSearch} className="max-w-4xl mx-auto" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFilterChange={updateFilters}
              onClearFilters={clearFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
          
          {/* Properties Section */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden"
                  icon="Filter"
                >
                  Filters
                </Button>
                
                <div className="text-sm text-gray-600">
                  {filteredProperties.length} properties found
                </div>
              </div>
              
<div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <ApperIcon name="List" size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'map' 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <ApperIcon name="Map" size={20} />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
{/* Properties Display */}
            {viewMode === 'map' ? (
              <PropertyMap
                properties={sortedProperties}
                loading={loading}
                error={error}
                onFavorite={toggleFavorite}
                onRetry={loadProperties}
                onClearFilters={clearFilters}
              />
            ) : (
              <PropertyGrid
                properties={sortedProperties}
                loading={loading}
                error={error}
                onFavorite={toggleFavorite}
                onRetry={loadProperties}
                onClearFilters={clearFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;