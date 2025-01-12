import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Message } from './types';
import { chatCompletion, ChatMessage } from '../../services/api';
import MobileHeader, { MobileComponents } from '../common/MobileHeader';
import FeatureCard from '../common/FeatureCard';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // 处理功能卡片点击
  const handleFeatureClick = (message: string) => {
    const event = new CustomEvent('submit', {
      detail: { message }
    }) as any;
    event.target = { message };
    handleSubmit(event);
  };

  // 渲染移动端界面
  const renderMobileView = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col h-full">
          <MobileHeader 
            title="Lawbot AI" 
            subtitle="专业的法律智能助手"
          />
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-4">
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-yellow-50 rounded-full mb-4 shadow-md">
                  <UserCircleIcon className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  您的私人法律顾问，为您提供专业的法律咨询服务
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <FeatureCard
                  icon="💬"
                  title="专业解答法律问题"
                  description="智能法律顾问为您解答各类法律问题，提供专业建议"
                  onClick={() => handleFeatureClick('我需要法律咨询服务，请问您能为我提供哪些帮助？')}
                />
                <FeatureCard
                  icon="📝"
                  title="快速生成法律文书"
                  description="快速生成各类法律文书，包括合同、协议、诉讼文书等"
                  onClick={() => handleFeatureClick('我需要生成一份法律文书，请问您能为我提供哪些类型的文书模板？')}
                />
                <FeatureCard
                  icon="🔍"
                  title="海量案例检索"
                  description="海量案例库检索，找到与您情况相似的典型案例"
                  onClick={() => handleFeatureClick('我想查找相关的法律案例，请问您能帮我检索吗？')}
                />
                <FeatureCard
                  icon="📋"
                  title="智能合同审查"
                  description="智能分析合同条款，识别潜在风险，提供修改建议"
                  onClick={() => handleFeatureClick('我需要审查一份合同，请问您能为我分析合同条款吗？')}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <MobileHeader 
          title="AI法律助手" 
          subtitle="正在为您服务"
          onBack={() => setMessages([])}
        />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-lg mx-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-yellow-50 border-blue-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <UserCircleIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl px-4 py-3 shadow-sm border ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-[10px] mt-1 text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入您的法律问题..."
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-base placeholder:text-gray-400"
                  rows={1}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 
                  transition-colors shadow-lg"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-6 w-6 animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* 移动端显示 */}
      <div className="sm:hidden h-full flex flex-col">
        {renderMobileView()}
      </div>

      {/* 桌面端显示 */}
      <div className="hidden sm:flex flex-col h-full">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-4 md:p-6">
            <div className="text-center w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-blue-200">
              <div className="inline-block p-3 bg-yellow-50 rounded-full mb-4 shadow-md">
                <UserCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                Lawbot AI
              </h1>
              <h2 className="text-lg md:text-xl font-medium text-gray-700 mb-6">
                专业的法律智能助手，为您提供全方位的法律服务支持
              </h2>
              <button
                onClick={() => setMessages([{
                  id: Date.now().toString(),
                  content: '您好，我是您的AI法律助手，请问有什么可以帮您？',
                  role: 'assistant',
                  timestamp: new Date().toISOString()
                }])}
                className="w-full max-w-sm mx-auto p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl
                  font-medium text-lg shadow-lg hover:shadow-xl
                  transform hover:-translate-y-1 active:translate-y-0
                  transition-all duration-200
                  flex items-center justify-center gap-3"
              >
                <span className="text-2xl">💬</span>
                开始对话
              </button>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ChatWindow; 