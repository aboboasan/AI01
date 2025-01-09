import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', color = 'text-white' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-transparent ${sizeClasses[size]} ${color}`}></div>
    </div>
  );
};

export default Loading; 