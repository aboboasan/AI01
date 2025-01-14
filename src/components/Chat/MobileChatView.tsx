import React from 'react';
import MobileHeader from '../common/MobileHeader';
import VirtualList from '../common/VirtualList';
import { Message } from './types';

interface MobileChatViewProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  textareaHeight: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
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
  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`
            max-w-[80%] rounded-lg p-4
            ${isUser
              ? 'bg-blue-500 text-white'
              : isSystem
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-800'
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <div
            className={`
              text-xs mt-2
              ${isUser
                ? 'text-blue-100'
                : isSystem
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              }
            `}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  const getMessageHeight = (message: Message) => {
    // 简单估算消息高度
    const lineCount = Math.ceil(message.content.length / 50); // 假设每行50个字符
    return lineCount * 24 + 48; // 每行24px + padding
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

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
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
          <VirtualList
            items={messages}
            renderItem={renderMessage}
            itemSize={getMessageHeight}
            height={window.innerHeight - 200}
            className="pt-4"
          />
        )}
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="输入您的问题..."
            className="w-full pr-20 resize-none rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            style={{ height: textareaHeight }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              absolute right-2 bottom-2 px-4 py-2 rounded-lg
              transition-colors duration-200
              ${
                isLoading || !input.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              '发送'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileChatView; 