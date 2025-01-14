import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSubmit: (value: string) => void;
  onFileUpload?: (file: File) => void;
  placeholder?: string;
  showFileUpload?: boolean;
  isLoading?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  onSubmit,
  onFileUpload,
  placeholder = '请输入内容...',
  showFileUpload = false,
  isLoading = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end space-x-2 bg-white rounded-lg border border-gray-200 p-2">
        {showFileUpload && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-none p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="上传文件"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.doc,.docx,.pdf"
            />
          </>
        )}
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 max-h-[200px] resize-none overflow-y-auto bg-transparent border-0 focus:ring-0 p-2 text-gray-900 placeholder-gray-500"
          rows={1}
        />
        
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={`flex-none p-2 rounded-lg ${
            input.trim() && !isLoading
              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              : 'text-gray-400'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea; 