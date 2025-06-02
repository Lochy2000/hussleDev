import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'text' | 'avatar';
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  count = 1, 
  type = 'card',
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-dark-800 rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-dark-700" />
            <div className="p-5">
              <div className="h-6 bg-dark-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-dark-700 rounded w-full mb-4" />
              <div className="h-4 bg-dark-700 rounded w-5/6 mb-6" />
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-16 bg-dark-700 rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 bg-dark-700 rounded" />
                <div className="h-4 bg-dark-700 rounded" />
              </div>
            </div>
          </div>
        );

      case 'text':
        return <div className="h-4 bg-dark-700 rounded animate-pulse" />;

      case 'avatar':
        return (
          <div className="w-10 h-10 rounded-full bg-dark-700 animate-pulse" />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;