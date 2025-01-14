import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Message } from './types';
import VirtualList from '../common/VirtualList';

interface ChatWindowProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  textareaHeight: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  isLoading,
  textareaHeight,
  onInputChange,
  onKeyDown,
  onSubmit,
  textareaRef,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastMessageRef = useRef<string>('');

  // 自动滚动到底部，使用 RAF 确保平滑滚动
  const scrollToBottom = useCallback(() => {
    if (autoScroll && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [autoScroll]);

  // 监听新消息和加载状态
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.content !== lastMessageRef.current) {
      lastMessageRef.current = lastMessage.content;
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // 监听滚动事件，使用节流优化性能
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setAutoScroll(isNearBottom);
  }, []);

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isFirst = index === 0;
    const isLast = index === messages.length - 1;
    
    return (
      <div 
        key={message.id} 
        className={`
          flex ${isUser ? 'justify-end' : 'justify-start'} 
          ${isFirst ? 'mt-4' : 'mt-2'} 
          ${isLast ? 'mb-4' : 'mb-2'}
          animate-fadeIn
        `}
      >
        {!isUser && !isSystem && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-2 flex-shrink-0">
            <span className="text-blue-600 text-sm">AI</span>
          </div>
        )}
        <div 
          className={`
            relative
            max-w-[75%] p-4 rounded-2xl shadow-md 
            transform transition-all duration-200 hover:-translate-y-0.5
            ${isUser 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-4' 
              : isSystem
                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800'
            }
            ${!isUser && !isSystem ? 'ml-2' : ''}
            ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}
          `}
        >
          <p className="leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <span className={`
            text-xs mt-2 block opacity-60
            ${isUser ? 'text-gray-100' : 'text-gray-500'}
          `}>
            {message.timestamp}
          </span>
          {/* 添加小三角 */}
          <div className={`
            absolute top-0 w-0 h-0
            border-8 border-transparent
            ${isUser 
              ? 'right-0 border-t-blue-500 -translate-y-[0.5px]' 
              : !isSystem 
                ? 'left-0 border-t-gray-50 -translate-y-[0.5px]'
                : ''
            }
          `} />
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
            <span className="text-white text-sm">我</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 scroll-smooth"
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} className="h-4" />
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full mr-1" />
              <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full mr-1 delay-100" />
              <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full delay-200" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              style={{ height: textareaHeight }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg pr-20 
                shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                transition-all duration-200"
              placeholder="请描述您的法律问题，我会为您提供专业的建议..."
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                absolute right-2 bottom-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-blue-500 to-blue-600 text-white
                transform transition-all duration-200
                ${isLoading || !input.trim() 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:-translate-y-0.5 hover:shadow-md'
                }
              `}
            >
              发送
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500 text-center">
            按 Enter 发送消息，按 Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 