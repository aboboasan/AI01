import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Message } from './types';
import { chatCompletion, ChatMessage } from '../../services/api';
import MobileHeader from '../common/MobileHeader';
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
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {messages.length === 0 && (
        <>
          {/* 移动端显示 */}
          <div className="sm:hidden">
            <MobileHeader 
              title="Lawbot AI" 
              subtitle="专业的法律智能助手"
            />
            <div className="px-4 py-3 space-y-3">
              {[
                {
                  icon: '💬',
                  title: 'AI法律咨询',
                  description: '智能法律顾问为您解答各类法律问题，提供专业建议',
                  onClick: () => setInput('我需要法律咨询服务')
                },
                {
                  icon: '📝',
                  title: '文书生成',
                  description: '快速生成各类法律文书，包括合同、协议、诉讼文书等',
                  onClick: () => setInput('帮我生成法律文书')
                },
                {
                  icon: '🔍',
                  title: '案例检索',
                  description: '海量案例库检索，找到与您情况相似的典型案例',
                  onClick: () => setInput('查找相关法律案例')
                },
                {
                  icon: '📋',
                  title: '合同审查',
                  description: '智能分析合同条款，识别潜在风险，提供修改建议',
                  onClick: () => setInput('审查合同内容')
                }
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                />
              ))}
            </div>
          </div>

          {/* 桌面端显示 - 保持原有布局 */}
          <div className="hidden sm:flex flex-1 items-center justify-center p-4 md:p-6">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    title: 'AI法律咨询',
                    icon: '💬',
                    onClick: () => setInput('我需要法律咨询服务')
                  },
                  {
                    title: '文书生成',
                    icon: '📝',
                    onClick: () => setInput('帮我生成法律文书')
                  },
                  {
                    title: '案例检索',
                    icon: '🔍',
                    onClick: () => setInput('查找相关法律案例')
                  },
                  {
                    title: '合同审查',
                    icon: '📋',
                    onClick: () => setInput('审查合同内容')
                  }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="flex flex-col items-center justify-center p-4 bg-yellow-50 border border-blue-200 rounded-xl text-gray-700
                      hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300
                      transform hover:-translate-y-1 active:translate-y-0
                      shadow hover:shadow-md
                      transition-all duration-200"
                  >
                    <span className="text-2xl mb-2">{item.icon}</span>
                    <span className="text-sm md:text-base font-medium">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 消息列表 - 移动端和桌面端共用，但样式响应式 */}
      {messages.length > 0 && (
        <>
          <div className="sm:hidden">
            <MobileHeader 
              title="AI法律助手" 
              subtitle="正在为您服务"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4 md:space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border ${
                      message.role === 'user'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-yellow-50 border-blue-200'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                    ) : (
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-2xl px-4 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 shadow-sm border ${
                      message.role === 'user'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-blue-200'
                    }`}
                  >
                    <div 
                      className={`${
                        message.role === 'user' 
                          ? 'text-gray-800 text-sm sm:text-base leading-relaxed' 
                          : 'text-gray-700 text-sm sm:text-base leading-relaxed'
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </>
      )}

      {/* 输入区域 - 移动端和桌面端共用，但样式响应式 */}
      <div className="border-t border-blue-200 bg-white p-2 sm:p-3 md:p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入您的法律问题..."
                className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 border border-blue-200 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-300
                  text-gray-700 placeholder-gray-400 resize-none 
                  min-h-[44px] sm:min-h-[48px] max-h-[120px] sm:max-h-[200px] leading-normal
                  shadow-sm hover:shadow transition-all duration-200"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`
                w-12 sm:w-auto px-0 sm:px-4 rounded-xl flex items-center justify-center sm:gap-2 transition-all duration-200
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
                  <span className="font-medium hidden sm:inline">
                    发送
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 