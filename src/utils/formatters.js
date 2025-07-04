export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatSquareFeet = (sqft) => {
  if (typeof sqft !== 'number') return '0 sq ft';
  
  return `${new Intl.NumberFormat('en-US').format(sqft)} sq ft`;
};

export const formatAddress = (address, city, state, zipCode) => {
  const parts = [address, city, state, zipCode].filter(Boolean);
  return parts.join(', ');
};