import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-1 text-sm text-red-600">
          {message}
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-4 text-red-400 hover:text-red-500"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 