import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  className = '', 
  icon,
  ...props 
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${icon ? 'pl-10' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default Input; 