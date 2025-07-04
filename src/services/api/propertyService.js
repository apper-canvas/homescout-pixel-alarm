import { toast } from 'react-toastify';

export const propertyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "amenities" } },
          { field: { Name: "coordinates_lat" } },
          { field: { Name: "coordinates_lng" } },
          { field: { Name: "listing_date" } }
        ],
        orderBy: [
          {
            fieldName: "listing_date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title || property.Name,
        price: property.price,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        propertyType: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        yearBuilt: property.year_built,
        description: property.description,
        images: property.images ? property.images.split(',') : [],
        amenities: property.amenities ? property.amenities.split(',') : [],
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        listingDate: property.listing_date,
        isFavorite: false
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },
  
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "property_type" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "year_built" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "amenities" } },
          { field: { Name: "coordinates_lat" } },
          { field: { Name: "coordinates_lng" } },
          { field: { Name: "listing_date" } }
        ]
      };
      
      const response = await apperClient.getRecordById('property', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      const property = response.data;
      return {
        Id: property.Id,
        title: property.title || property.Name,
        price: property.price,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        propertyType: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.square_feet,
        yearBuilt: property.year_built,
        description: property.description,
        images: property.images ? property.images.split(',') : [],
        amenities: property.amenities ? property.amenities.split(',') : [],
        coordinates: {
          lat: property.coordinates_lat,
          lng: property.coordinates_lng
        },
        listingDate: property.listing_date,
        isFavorite: false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  async create(propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          title: propertyData.title,
          price: propertyData.price,
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zip_code: propertyData.zipCode,
          property_type: propertyData.propertyType,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          square_feet: propertyData.squareFeet,
          year_built: propertyData.yearBuilt,
          description: propertyData.description,
          images: Array.isArray(propertyData.images) ? propertyData.images.join(',') : propertyData.images,
          amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities.join(',') : propertyData.amenities,
          coordinates_lat: propertyData.coordinates?.lat,
          coordinates_lng: propertyData.coordinates?.lng,
          listing_date: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  async update(id, propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = { Id: id };
      
      // Only include updateable fields
      if (propertyData.title !== undefined) updateData.title = propertyData.title;
      if (propertyData.price !== undefined) updateData.price = propertyData.price;
      if (propertyData.address !== undefined) updateData.address = propertyData.address;
      if (propertyData.city !== undefined) updateData.city = propertyData.city;
      if (propertyData.state !== undefined) updateData.state = propertyData.state;
      if (propertyData.zipCode !== undefined) updateData.zip_code = propertyData.zipCode;
      if (propertyData.propertyType !== undefined) updateData.property_type = propertyData.propertyType;
      if (propertyData.bedrooms !== undefined) updateData.bedrooms = propertyData.bedrooms;
      if (propertyData.bathrooms !== undefined) updateData.bathrooms = propertyData.bathrooms;
      if (propertyData.squareFeet !== undefined) updateData.square_feet = propertyData.squareFeet;
      if (propertyData.yearBuilt !== undefined) updateData.year_built = propertyData.yearBuilt;
      if (propertyData.description !== undefined) updateData.description = propertyData.description;
      if (propertyData.images !== undefined) {
        updateData.images = Array.isArray(propertyData.images) ? propertyData.images.join(',') : propertyData.images;
      }
      if (propertyData.amenities !== undefined) {
        updateData.amenities = Array.isArray(propertyData.amenities) ? propertyData.amenities.join(',') : propertyData.amenities;
      }
      if (propertyData.coordinates?.lat !== undefined) updateData.coordinates_lat = propertyData.coordinates.lat;
      if (propertyData.coordinates?.lng !== undefined) updateData.coordinates_lng = propertyData.coordinates.lng;
      if (propertyData.listingDate !== undefined) updateData.listing_date = propertyData.listingDate;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },
  
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting property:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },
  
  async getNeighborhoodStats(propertyId) {
    // Keep mock implementation for neighborhood stats as this is supplementary data
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(250);
    
    // Generate consistent stats based on property ID
    const seed = propertyId || 1;
    
    return {
      schools: [
        {
          name: "Westfield Elementary School",
          type: "Elementary",
          rating: 4.2 + (seed % 3) * 0.2,
          distance: 0.3 + (seed % 5) * 0.1,
          grades: "K-5"
        },
        {
          name: "Lincoln Middle School",
          type: "Middle School",
          rating: 3.8 + (seed % 4) * 0.3,
          distance: 0.8 + (seed % 6) * 0.2,
          grades: "6-8"
        },
        {
          name: "Roosevelt High School",
          type: "High School",
          rating: 4.0 + (seed % 3) * 0.3,
          distance: 1.2 + (seed % 4) * 0.3,
          grades: "9-12"
        }
      ],
      transit: [
        {
          type: "Bus",
          route: "Route 42",
          walkTime: 3 + (seed % 8),
          frequency: "Every 15 min"
        },
        {
          type: "Bus",
          route: "Route 18",
          walkTime: 7 + (seed % 10),
          frequency: "Every 20 min"
        },
        {
          type: "Train",
          route: "Metro Blue Line",
          walkTime: 12 + (seed % 15),
          frequency: "Every 12 min"
        }
      ],
      amenities: [
        {
          name: "Central Park",
          category: "Parks",
          rating: 4.3 + (seed % 2) * 0.2,
          distance: 0.4 + (seed % 3) * 0.2,
          icon: "Trees"
        },
        {
          name: "Whole Foods Market",
          category: "Grocery",
          rating: 4.1 + (seed % 3) * 0.3,
          distance: 0.6 + (seed % 4) * 0.2,
          icon: "ShoppingCart"
        },
        {
          name: "Riverside Shopping Center",
          category: "Shopping",
          rating: 3.9 + (seed % 4) * 0.2,
          distance: 1.1 + (seed % 5) * 0.3,
          icon: "ShoppingBag"
        },
        {
          name: "Bella Vista Restaurant",
          category: "Dining",
          rating: 4.4 + (seed % 2) * 0.3,
          distance: 0.8 + (seed % 6) * 0.2,
          icon: "Utensils"
        },
        {
          name: "Community Gym",
          category: "Fitness",
          rating: 4.0 + (seed % 3) * 0.2,
          distance: 0.5 + (seed % 4) * 0.2,
          icon: "Dumbbell"
        }
      ]
    };
  }
};