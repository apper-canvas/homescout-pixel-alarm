import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyImageGallery from '@/components/molecules/PropertyImageGallery';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { propertyService } from '@/services/api/propertyService';
import { contactService } from '@/services/api/contactService';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { formatPrice } from '@/utils/formatters';
import NeighborhoodStats from '@/components/molecules/NeighborhoodStats';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const { savedProperties, toggleFavorite } = useSavedProperties();
  useEffect(() => {
    loadProperty();
  }, [id]);
  
  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getById(parseInt(id));
      setProperty(data);
    } catch (err) {
      setError(err.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFavorite = () => {
    toggleFavorite(parseInt(id));
    const isFavorite = savedProperties.some(p => p.Id === parseInt(id));
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };
  
const handleContact = () => {
    setShowContactModal(true);
  };
  
  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };
  
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!contactForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      setContactLoading(true);
      
      const inquiryData = {
        ...contactForm,
        propertyId: property.Id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        inquiryType: 'property-contact',
        timestamp: new Date().toISOString()
      };
      
      const response = await contactService.sendPropertyInquiry(inquiryData);
      
      if (response.success) {
        toast.success(response.message);
        handleCloseContactModal();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };
  
  const handleScheduleTour = () => {
    toast.success('Tour scheduling would open here');
  };
  
  if (loading) {
    return <Loading type="property-detail" />;
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Error 
          title="Property not found"
          message={error}
          onRetry={loadProperty}
        />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Error 
          title="Property not found"
          message="The property you're looking for doesn't exist or has been removed."
          showRetry={false}
        />
      </div>
    );
  }
  
  const isFavorite = savedProperties.some(p => p.Id === property.Id);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'features', label: 'Features', icon: 'Star' },
    { id: 'location', label: 'Location', icon: 'MapPin' },
    { id: 'contact', label: 'Contact', icon: 'Phone' }
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors duration-200"
      >
        <ApperIcon name="ArrowLeft" size={20} />
        Back to listings
      </motion.button>
      
      {/* Property Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <PropertyImageGallery 
          images={property.images} 
          title={property.title}
        />
      </motion.div>
      
      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <ApperIcon name="MapPin" size={20} className="mr-2" />
                  <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="price-badge text-2xl mb-2">
                  {formatPrice(property.price)}
                </div>
                <Badge variant="primary">
                  {property.propertyType}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ApperIcon name="Bed" size={24} className="mx-auto mb-2 text-primary" />
                <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ApperIcon name="Bath" size={24} className="mx-auto mb-2 text-primary" />
                <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ApperIcon name="Square" size={24} className="mx-auto mb-2 text-primary" />
                <div className="font-semibold text-gray-900">{property.squareFeet.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 text-primary" />
                <div className="font-semibold text-gray-900">{property.yearBuilt}</div>
                <div className="text-sm text-gray-600">Built</div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Amenities & Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ApperIcon name="Check" size={16} className="text-success" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'location' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <ApperIcon name="MapPin" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Interactive map would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Real Estate Agent</h4>
                        <p className="text-gray-600">Licensed Professional</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Phone" size={18} className="text-primary" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ApperIcon name="Mail" size={18} className="text-primary" />
                        <span>agent@homescout.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
</motion.div>
          
          {/* Neighborhood Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Neighborhood Statistics
            </h2>
            <NeighborhoodStats propertyId={property.Id} />
          </motion.div>
        </div>
        
        {/* Action Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
          >
            <div className="space-y-4">
              <Button
                onClick={handleScheduleTour}
                className="w-full"
                icon="Calendar"
              >
                Schedule Tour
              </Button>
              
              <Button
                onClick={handleContact}
                variant="secondary"
                className="w-full"
                icon="Phone"
              >
                Contact Agent
              </Button>
              
              <Button
                onClick={handleFavorite}
                variant={isFavorite ? "accent" : "outline"}
                className="w-full"
                icon="Heart"
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Share this property</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="small" className="flex-1">
                    <ApperIcon name="Facebook" size={18} />
                  </Button>
                  <Button variant="outline" size="small" className="flex-1">
                    <ApperIcon name="Twitter" size={18} />
                  </Button>
                  <Button variant="outline" size="small" className="flex-1">
                    <ApperIcon name="Share" size={18} />
                  </Button>
                </div>
              </div>
</div>
          </motion.div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Contact Agent
                </h2>
                <button
                  onClick={handleCloseContactModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real Estate Agent</h3>
                    <p className="text-sm text-gray-600">Licensed Professional</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Regarding Property:</h4>
                  <p className="text-sm text-gray-700">{property?.title}</p>
                  <p className="text-sm font-semibold text-primary">{formatPrice(property?.price)}</p>
                </div>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                    placeholder="I'm interested in this property. Please contact me with more information."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseContactModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={contactLoading}
                    className="flex-1"
                    icon="Send"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;