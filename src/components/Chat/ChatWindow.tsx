import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Message } from './types';
import { chatCompletion, ChatMessage } from '../../services/api';
import MobileHeader from '../common/MobileHeader';
import MobileChatView from './MobileChatView';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('44px');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      const scrollHeight = Math.min(textareaRef.current.scrollHeight, 200);
      const newHeight = Math.max(44, scrollHeight);
      textareaRef.current.style.height = newHeight + 'px';
      setTextareaHeight(newHeight + 'px');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !e.nativeEvent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input || (e as any).target?.message,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      apiMessages.unshift({
        role: 'system',
        content: `作为您的私人法律顾问，我将始终站在您的立场，全心全意维护您的合法权益：

1. 利益优先：我会始终以保护您的合法权益为首要任务
2. 风险防范：帮您预见并规避潜在法律风险
3. 成本意识：建议最经济有效的解决方案
4. 通俗易懂：用清晰易懂的语言解释复杂的法律问题
5. 实用建议：提供具体可行的操作建议

我将：
- 仔细分析您的具体情况
- 引用相关法律法规
- 提供多个解决方案及其利弊分析
- 特别提示时效性要求和注意事项
- 建议是否需要寻求线下律师帮助

让我们开始吧，请详细描述您的问题。`
      });
      apiMessages.push({
        role: 'user',
        content: userMessage.content
      });

      const response = await chatCompletion(apiMessages);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('API调用错误:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 渲染移动端界面
  const renderMobileView = () => {
    return (
      <div className="flex flex-col h-screen">
        <MobileHeader 
          title="AI法律咨询" 
          subtitle="为您提供专业的法律咨询服务"
          onBack={() => {
            setMessages([]);
            setInput('');
          }}
        />
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 bg-gray-50">
          {messages.map((message, index) => (
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
                className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="请输入您的法律问题..."
              className="flex-1 min-h-[44px] max-h-32 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ height: textareaHeight }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 text-white animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderDesktopView = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center p-3 md:p-4">
          <div className="text-center w-full max-w-xl mx-4 bg-white rounded-xl shadow-md p-4 md:p-6 border border-blue-200">
            <div className="inline-block p-2 bg-yellow-50 rounded-full mb-3 shadow-sm">
              <UserCircleIcon className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              AI法律助手
            </h1>
            <h2 className="text-base md:text-lg font-medium text-gray-700 mb-4">
              专业的法律智能助手，为您提供全方位的法律服务支持
            </h2>
            <button
              onClick={() => setMessages([{
                id: Date.now().toString(),
                content: '您好，我是您的AI法律助手，请问有什么可以帮您？',
                role: 'assistant',
                timestamp: new Date().toISOString()
              }])}
              className="w-full max-w-sm mx-auto p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl
                font-medium text-base shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200
                flex items-center justify-center gap-2"
            >
              <span className="text-xl">💬</span>
              开始对话
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-yellow-50 border-blue-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <UserCircleIcon className="h-6 w-6 text-blue-500" />
                  ) : (
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm border ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="text-base leading-relaxed text-gray-800">
                    {message.content}
                  </div>
                  <div className="text-xs mt-2 text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t border-blue-200 bg-white p-3 md:p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入您的法律问题..."
                  className="w-full px-4 py-3 text-base bg-gray-50 border border-blue-200 rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-300
                    text-gray-700 placeholder-gray-400 resize-none 
                    min-h-[48px] max-h-[200px] leading-normal
                    shadow-sm hover:shadow transition-all duration-200"
                  disabled={isLoading}
                  rows={1}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`
                  px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200
                  border shadow-sm hover:shadow
                  ${input.trim() && !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5" />
                    <span className="font-medium">发送</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* 移动端显示 */}
      <div className="sm:hidden h-full flex flex-col">
        <MobileChatView
          messages={messages}
          input={input}
          isLoading={isLoading}
          textareaHeight={textareaHeight}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          onBack={() => {
            setMessages([]);
            setInput('');
          }}
          textareaRef={textareaRef}
        />
      </div>

      {/* 桌面端显示 */}
      <div className="hidden sm:flex flex-col h-full">
        {renderDesktopView()}
      </div>
    </div>
  );
};

export default ChatWindow; 