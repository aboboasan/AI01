import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 border border-blue-100 shadow-sm
        active:transform active:scale-95 transition-all duration-200
        hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default FeatureCard; 