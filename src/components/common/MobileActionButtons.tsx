import React from 'react';
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

interface MobileActionButtonsProps {
  onPreview: () => void;
  onDownload: () => void;
  showPreview: boolean;
  showDownload: boolean;
}

const MobileActionButtons: React.FC<MobileActionButtonsProps> = ({
  onPreview,
  onDownload,
  showPreview,
  showDownload,
}) => {
  const { theme } = useTheme();

  if (!showPreview && !showDownload) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${theme.colors.surface} border-t ${theme.colors.border} shadow-lg z-50`}>
      <div className="flex justify-around p-4 gap-4">
        {showPreview && (
          <button
            onClick={onPreview}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              ${theme.colors.text.secondary} ${theme.colors.surface} border ${theme.colors.border}
            `}
          >
            <EyeIcon className="h-5 w-5" />
            <span className="font-medium text-sm">预览报告</span>
          </button>
        )}
        {showDownload && (
          <button
            onClick={onDownload}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              ${theme.colors.text.accent} ${theme.colors.active}
            `}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span className="font-medium text-sm">下载报告</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileActionButtons; 