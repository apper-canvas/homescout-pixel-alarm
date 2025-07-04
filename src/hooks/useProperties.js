import { useState } from 'react';
import { propertyService } from '@/services/api/propertyService';

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };
  
  const getProperty = async (id) => {
    try {
      setError(null);
      const data = await propertyService.getById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load property');
      return null;
    }
  };
  
  return {
    properties,
    loading,
    error,
    loadProperties,
    getProperty
  };
};