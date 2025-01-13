import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface PreviewPageProps {
  content: string;
  onBack: () => void;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ content, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>返回分析页面</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">案件分析报告预览</h1>
            <div className="w-20"></div> {/* 为了保持标题居中 */}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-blue max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage; 