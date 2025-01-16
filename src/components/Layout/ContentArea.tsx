import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ContentAreaProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ title, description, children }) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${theme.colors.text.primary} mb-2`}>
          {title}
        </h1>
        <p className={`${theme.colors.text.secondary} max-w-2xl mx-auto`}>
          {description}
        </p>
      </div>
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
};

export default ContentArea; 