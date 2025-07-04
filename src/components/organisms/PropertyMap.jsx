import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import L from 'leaflet';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { formatPrice } from '@/utils/formatters';
import { useSavedProperties } from '@/hooks/useSavedProperties';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (price) => {
  const priceText = formatPrice(price);
  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, #2C5F2D 0%, #97BC62 100%);
      color: white;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      min-width: 60px;
      box-shadow: 0 2px 8px rgba(44, 95, 45, 0.3);
      border: 2px solid white;
    ">
      ${priceText}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-price-marker',
    iconSize: [80, 32],
    iconAnchor: [40, 16],
    popupAnchor: [0, -16],
  });
};

const PropertyMap = ({ 
  properties, 
  loading, 
  error, 
  onFavorite, 
  onRetry,
  onClearFilters 
}) => {
  const navigate = useNavigate();
  const { savedProperties } = useSavedProperties();

  // Calculate map center based on properties
  const mapCenter = useMemo(() => {
    if (!properties || properties.length === 0) {
      return [39.8283, -98.5795]; // Center of USA
    }
    
    const validProperties = properties.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    if (validProperties.length === 0) {
      return [39.8283, -98.5795];
    }
    
    const avgLat = validProperties.reduce((sum, p) => sum + p.coordinates.lat, 0) / validProperties.length;
    const avgLng = validProperties.reduce((sum, p) => sum + p.coordinates.lng, 0) / validProperties.length;
    
    return [avgLat, avgLng];
  }, [properties]);

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleFavoriteClick = (e, property) => {
    e.stopPropagation();
    onFavorite(property.Id);
  };

  if (loading) {
    return <Loading type="map" />;
  }
  
  if (error) {
    return (
      <Error 
        title="Unable to load map"
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
        icon="Map"
      />
    );
  }

  // Filter properties with valid coordinates
  const validProperties = properties.filter(p => p.coordinates?.lat && p.coordinates?.lng);

  if (validProperties.length === 0) {
    return (
      <Empty 
        title="No properties with location data"
        message="Properties in your current filter selection don't have location information."
        actionLabel="Clear Filters"
        onAction={onClearFilters}
        icon="MapPin"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg"
    >
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {validProperties.map((property) => (
            <Marker
              key={property.Id}
              position={[property.coordinates.lat, property.coordinates.lng]}
              icon={createCustomIcon(property.price)}
            >
              <Popup
                closeButton={false}
                className="custom-popup"
                minWidth={280}
                maxWidth={300}
              >
                <div className="p-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {property.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {property.address}, {property.city}, {property.state}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{property.bedrooms} bed</span>
                        <span>•</span>
                        <span>{property.bathrooms} bath</span>
                        <span>•</span>
                        <span>{property.squareFeet?.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(property.price)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {property.propertyType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      onClick={() => handlePropertyClick(property.Id)}
                      className="flex-1 text-xs"
                    >
                      View Details
                    </Button>
                    <button
                      onClick={(e) => handleFavoriteClick(e, property)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        savedProperties.includes(property.Id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ApperIcon 
                        name={savedProperties.includes(property.Id) ? "Heart" : "Heart"} 
                        size={16}
                        className={savedProperties.includes(property.Id) ? "fill-current" : ""}
                      />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </motion.div>
  );
};

export default PropertyMap;