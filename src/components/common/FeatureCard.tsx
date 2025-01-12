import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border border-gray-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-none text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
        <div className="flex-none text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default FeatureCard; 