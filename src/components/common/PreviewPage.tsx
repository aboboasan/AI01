import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PreviewPageProps {
  content: string;
  onBack: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ content, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        返回
      </button>

      {/* 预览内容 */}
      <div className="bg-white rounded-lg shadow-lg p-6 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};

export default PreviewPage; 