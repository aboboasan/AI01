import React, { useRef, useEffect } from 'react';
import MobileHeader from '../common/MobileHeader';
import './mobile.css';

interface MobileChatViewProps {
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听消息变化，自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      {/* 消息列表 - 添加平滑滚动效果 */}
      <div 
        ref={messageListRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-20 scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
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
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-6 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-message-in`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-sm font-medium">AI</span>
                  </div>
                )}
                <div
                  className={`relative max-w-[90%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleLongPress(message.content);
                  }}
                >
                  <div className="text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <div className="text-xs mt-2 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center ml-2">
                    <span className="text-blue-600 text-sm">我</span>
                  </div>
                )}
              </div>
            ))}
            {/* 用于自动滚动的空白元素 */}
            <div ref={messagesEndRef} className="h-4" />
            {/* 加载状态指示器 */}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部输入区域 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          onSubmit(e); 
        }} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative min-h-[56px] bg-white rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="请输入您的问题..."
                className="w-full h-full resize-none rounded-lg px-4 py-3 text-base focus:outline-none bg-transparent"
                style={{
                  minHeight: '56px',
                  height: textareaHeight,
                  maxHeight: '150px'
                }}
                rows={1}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`h-[56px] px-8 rounded-lg text-base font-medium flex items-center justify-center min-w-[100px] ${
              input.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400'
            } transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <span>发送</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileChatView; 