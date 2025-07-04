import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      setSavedProperties(JSON.parse(saved));
    }
  }, []);
  
  const saveToLocalStorage = (properties) => {
    localStorage.setItem('savedProperties', JSON.stringify(properties));
  };
  
  const toggleFavorite = (propertyId) => {
    setSavedProperties(prev => {
      const exists = prev.find(p => p.Id === propertyId);
      let newSaved;
      
      if (exists) {
        newSaved = prev.filter(p => p.Id !== propertyId);
        toast.success('Property removed from favorites');
      } else {
        newSaved = [...prev, { Id: propertyId, savedAt: new Date().toISOString() }];
        toast.success('Property added to favorites');
      }
      
      saveToLocalStorage(newSaved);
      return newSaved;
    });
  };
  
  const clearAllFavorites = () => {
    setSavedProperties([]);
    saveToLocalStorage([]);
    toast.success('All favorites cleared');
  };
  
  const isFavorite = (propertyId) => {
    return savedProperties.some(p => p.Id === propertyId);
  };
  
  return {
    savedProperties,
    toggleFavorite,
    clearAllFavorites,
    isFavorite
  };
};