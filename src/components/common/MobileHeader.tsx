import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

// 使用命名空间来避免类型冲突
export namespace MobileComponents {
  export interface HeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
  }
}

const MobileHeader: React.FC<MobileComponents.HeaderProps> = ({ 
  title, 
  subtitle, 
  onBack 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="返回"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// 使用 as const 确保类型安全
export const MOBILE_HEADER_TEST_IDS = {
  BACK_BUTTON: 'mobile-header-back-button',
  TITLE: 'mobile-header-title',
  SUBTITLE: 'mobile-header-subtitle',
} as const;

// 导出默认组件
export default MobileHeader; 