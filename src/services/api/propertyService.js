import mockProperties from '@/services/mockData/properties.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(300);
    return mockProperties.map(property => ({
      ...property,
      isFavorite: false
    }));
  },
  
  async getById(id) {
    await delay(200);
    const property = mockProperties.find(p => p.Id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return {
      ...property,
      isFavorite: false
    };
  },
  
  async create(propertyData) {
    await delay(400);
    const newProperty = {
      ...propertyData,
      Id: Math.max(...mockProperties.map(p => p.Id)) + 1,
      listingDate: new Date().toISOString(),
      isFavorite: false
    };
    mockProperties.push(newProperty);
    return newProperty;
  },
  
  async update(id, propertyData) {
    await delay(300);
    const index = mockProperties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    mockProperties[index] = { ...mockProperties[index], ...propertyData };
    return mockProperties[index];
  },
  
  async delete(id) {
    await delay(200);
    const index = mockProperties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
const deletedProperty = mockProperties.splice(index, 1)[0];
    return deletedProperty;
  },
  
  async getNeighborhoodStats(propertyId) {
    await delay(250);
    // Generate consistent stats based on property ID
    const seed = propertyId || 1;
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
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