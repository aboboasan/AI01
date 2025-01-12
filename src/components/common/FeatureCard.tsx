import React from 'react';

interface FeatureCardProps {
  title: string;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  description?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  onClick,
  className = '',
  icon,
  description
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
};

export default FeatureCard; 