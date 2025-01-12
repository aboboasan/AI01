import React from 'react';

interface FeatureViewProps {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
}

const MobileFeatureView: React.FC<FeatureViewProps> = ({
  title,
  icon,
  description,
  onClick
}) => {
  return (
    <div className="mobile-feature-view">
      <div className="feature-content">
        <span className="feature-icon">{icon}</span>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <button onClick={onClick} className="feature-action-button">
          开始使用
        </button>
      </div>
    </div>
  );
};

export default MobileFeatureView; 