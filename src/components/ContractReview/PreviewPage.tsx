import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

interface PreviewPageProps {
  content: string;
  onBack: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ content, onBack }) => {
  const { theme } = useTheme();

  return (
    <div className={`fixed inset-0 z-50 ${theme.colors.background}`}>
      {/* 顶部导航栏 */}
      <div className={`fixed top-0 left-0 right-0 ${theme.colors.surface} border-b ${theme.colors.border} shadow-sm z-10`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${theme.colors.hover} -ml-2`}
          >
            <ArrowLeftIcon className={`h-5 w-5 ${theme.colors.text.secondary}`} />
          </button>
          <h2 className={`ml-2 text-lg font-semibold ${theme.colors.text.primary}`}>
            合同审查报告
          </h2>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="h-full pt-14 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className={`${theme.colors.surface} rounded-lg shadow-md p-6`}>
            <div className={`whitespace-pre-wrap ${theme.colors.text.primary}`}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage; 