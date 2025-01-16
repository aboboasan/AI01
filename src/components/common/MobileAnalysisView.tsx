import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

interface MobileAnalysisViewProps {
  title: string;
  description: string;
  content: string;
  onBack: () => void;
}

const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  title,
  description,
  content,
  onBack,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.colors.background}`}>
      {/* 顶部导航栏 */}
      <div className={`fixed top-0 left-0 right-0 ${theme.colors.surface} border-b ${theme.colors.border} shadow-sm z-10`}>
        <div className="px-4 h-14 flex items-center">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${theme.colors.hover} -ml-2`}
          >
            <ArrowLeftIcon className={`h-5 w-5 ${theme.colors.text.secondary}`} />
          </button>
          <div className="ml-2">
            <h2 className={`text-lg font-semibold ${theme.colors.text.primary}`}>
              {title}
            </h2>
            <p className={`text-xs ${theme.colors.text.secondary}`}>
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pt-14 pb-16">
        <div className="p-4">
          <div className={`${theme.colors.surface} rounded-lg shadow-md p-4`}>
            <div className={`whitespace-pre-wrap ${theme.colors.text.primary} text-sm`}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAnalysisView; 