import React from 'react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="sm:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 添加一个占位 div，防止内容被固定定位的 header 遮挡 */}
      <div className="h-14" />
    </div>
  );
};

export default MobileHeader; 