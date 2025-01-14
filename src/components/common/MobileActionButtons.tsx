import React from 'react';
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface MobileActionButtonsProps {
  onPreview: () => void;
  onDownload: () => void;
  showPreview?: boolean;
  showDownload?: boolean;
}

const MobileActionButtons: React.FC<MobileActionButtonsProps> = ({
  onPreview,
  onDownload,
  showPreview = true,
  showDownload = true,
}) => {
  return (
    <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-50">
      {showPreview && (
        <button
          onClick={onPreview}
          className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          aria-label="预览"
        >
          <EyeIcon className="w-6 h-6" />
        </button>
      )}
      {showDownload && (
        <button
          onClick={onDownload}
          className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          aria-label="下载"
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MobileActionButtons; 