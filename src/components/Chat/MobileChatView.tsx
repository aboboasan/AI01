import React, { useRef } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Message } from './types';
import MobileHeader from '../common/MobileHeader';

interface MobileChatViewProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  textareaHeight: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MobileChatView: React.FC<MobileChatViewProps> = ({
  messages,
  input,
  isLoading,
  textareaHeight,
  onInputChange,
  onKeyDown,
  onSubmit,
  onBack,
  textareaRef,
}) => {
  // 长按消息处理
  const handleLongPress = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: 添加复制成功提示
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <MobileHeader 
          title="AI法律咨询" 
          subtitle="为您提供专业的法律咨询服务"
          onBack={onBack}
        />
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
            </div>
            <p className="text-base font-medium mb-2">欢迎使用AI法律咨询</p>
            <p className="text-sm text-center">
              请输入您的法律问题，<br />
              我会为您提供专业的建议
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-6 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm font-medium">AI</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm
                  ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                  }
                `}
                onTouchStart={() => {
                  let timer = setTimeout(() => handleLongPress(message.content), 500);
                  return () => clearTimeout(timer);
                }}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2">
                  <span className="text-gray-600 text-sm">我</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 底部输入区 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <form onSubmit={onSubmit} className="p-4">
          <div className="flex items-center space-x-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="请输入您的法律问题..."
              className="flex-1 min-h-[44px] max-h-32 p-3 bg-gray-50 border border-gray-300 
                rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent text-base leading-relaxed"
              style={{ height: textareaHeight }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center 
                disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 
                transition-all duration-200"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 text-white animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileChatView; 