import React, { useState } from 'react';

interface ContentAreaProps {
  title: string;
  description: string;
  children: React.ReactNode;
  inputArea?: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  title,
  description,
  children,
  inputArea,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 功能介绍区域 (5%) */}
      <div className="flex-none bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isDescriptionExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {isDescriptionExpanded && (
            <div className="mt-2 text-sm text-gray-600 animate-fadeIn">
              <p className="leading-relaxed">{description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 输出内容区域 (80%) */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-4">
            {children}
          </div>
        </div>
      </div>

      {/* 输入区域 (15%) */}
      {inputArea && (
        <div className="flex-none border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto p-4">
            {inputArea}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentArea; 