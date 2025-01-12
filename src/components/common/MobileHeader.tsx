import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  subtitle, 
  onBack 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="返回"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MobileHeader; 