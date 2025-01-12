import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  onBack,
  className = ''
}) => {
  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader; 