import React from 'react';

const Loading = ({ type = 'property-grid' }) => {
  if (type === 'property-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="skeleton h-48 w-full"></div>
            <div className="p-4 space-y-3">
              <div className="skeleton h-6 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-2/3 rounded"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-8 w-20 rounded-full"></div>
                <div className="skeleton h-8 w-8 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'property-detail') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="skeleton h-96 w-full rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="skeleton h-8 w-3/4 rounded"></div>
            <div className="skeleton h-6 w-1/2 rounded"></div>
            <div className="skeleton h-32 w-full rounded"></div>
            <div className="flex gap-4">
              <div className="skeleton h-16 w-16 rounded"></div>
              <div className="skeleton h-16 w-16 rounded"></div>
              <div className="skeleton h-16 w-16 rounded"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-64 w-full rounded"></div>
            <div className="skeleton h-12 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
}

  if (type === 'map') {
    return (
      <div className="h-96 w-full rounded-xl overflow-hidden bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-gray-600">Loading map...</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 opacity-50"></div>
        {/* Simulated map markers */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-8 w-4 h-4 bg-accent rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-8 left-1/3 w-4 h-4 bg-secondary rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-4 right-1/4 w-4 h-4 bg-primary rounded-full animate-pulse delay-300"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loading;