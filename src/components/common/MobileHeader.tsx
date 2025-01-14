import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="p-1 -ml-1 mr-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader; 