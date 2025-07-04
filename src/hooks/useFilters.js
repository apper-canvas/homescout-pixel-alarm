import { useState, useMemo } from 'react';

export const useFilters = (properties = []) => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    propertyTypes: [],
    bedroomsMin: 0,
    bathroomsMin: 0,
    squareFeetMin: 0,
    yearBuiltMin: 0
  });
  
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Price filter
      if (property.price < filters.priceMin || property.price > filters.priceMax) {
        return false;
      }
      
      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) {
        return false;
      }
      
      // Bedrooms filter
      if (property.bedrooms < filters.bedroomsMin) {
        return false;
      }
      
      // Bathrooms filter
      if (property.bathrooms < filters.bathroomsMin) {
        return false;
      }
      
      // Square feet filter
      if (property.squareFeet < filters.squareFeetMin) {
        return false;
      }
      
      // Year built filter
      if (filters.yearBuiltMin > 0 && property.yearBuilt < filters.yearBuiltMin) {
        return false;
      }
      
      return true;
    });
  }, [properties, filters]);
  
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 2000000,
      propertyTypes: [],
      bedroomsMin: 0,
      bathroomsMin: 0,
      squareFeetMin: 0,
      yearBuiltMin: 0
    });
  };
  
  return {
    filters,
    filteredProperties,
    updateFilters,
    clearFilters
  };
};