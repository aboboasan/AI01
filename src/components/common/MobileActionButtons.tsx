import React from 'react';

interface Action {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface MobileActionButtonsProps {
  actions: Action[];
}

const MobileActionButtons: React.FC<MobileActionButtonsProps> = ({ actions }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              action.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
            }`}
          >
            {action.icon}
            <span className="text-xs mt-1">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileActionButtons; 