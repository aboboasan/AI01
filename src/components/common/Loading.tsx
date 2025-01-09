import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-2 border-gray-300 border-t-blue-500
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

export default Loading; 