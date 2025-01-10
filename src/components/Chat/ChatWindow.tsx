import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Message } from './types';
import { chatCompletion, ChatMessage } from '../../services/api';
import { Input } from '../common/Input';

interface ChatWindowProps {
  chatId?: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setInput('');
    setShowWelcome(true);
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setShowWelcome(false);

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
      // 准备发送给API的消息历史
      const apiMessages: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // 添加系统提示和用户最新消息
      apiMessages.unshift({
        role: 'system',
        content: '你是一个专业的中国法律顾问，精通中国法律法规。请用专业、准确但易于理解的方式回答用户的法律问题。回答时应引用相关法律条款，并给出具体的建议。'
      });
      apiMessages.push({
        role: 'user',
        content: userMessage.content
      });

      // 调用API获取回复
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
      // 显示错误消息
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

  const exampleQuestions = [
    '同案犯退赃，对未退赃的被告人可以从轻处罚吗？',
    '父亲欠下高额债务，现父亲已去世，债主要求父债子还，这个有法律依据吗？',
    '我借了高利贷，约定月利率20%，我现在还不起了，这么高的利息，借款协议会受影响吗？',
    '对方和我签署借款协议，协议约定以对方名下的房屋作为抵押，后来才发现房屋已经被查封了'
  ];

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
        {showWelcome && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">
                您好，我是您的私人法律助手
              </h2>
              <p className="text-gray-500">
                我拥有法律领域的理解和推理能力，可以为您提供专业的法律咨询服务
              </p>
            </div>
            <div className="w-full max-w-3xl">
              <div className="text-sm text-gray-500 mb-4">您可以这样问我：</div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm text-gray-900">{question}</p>
                  </button>
                ))}
              </div>
              
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 overflow-hidden">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="输入您的问题..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 shadow-lg"
                      disabled={isLoading}
                      multiline
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`
                      px-4 py-2 rounded-lg flex items-center justify-center shadow-lg
                      ${input.trim() && !isLoading
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
                <div className="mt-2">
                  <p className="text-xs text-gray-400 px-4">
                    按Enter发送，按Shift+Enter换行
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant' ? 'bg-green-600 mr-3' : 'bg-blue-600 ml-3'
                  }`}>
                    {message.role === 'assistant' ? '法' : '我'}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 shadow-md ${
                    message.role === 'assistant' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-[80%]">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    法
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow-md">
                    <div className="flex items-center space-x-2">
                      <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                      <span className="text-gray-500">思考中...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!showWelcome && (
        <div className="border-t border-gray-100 p-4 bg-white">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex space-x-4">
            <div className="flex-1 overflow-hidden">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的问题..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 shadow-lg"
                disabled={isLoading}
                multiline
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`
                px-4 py-2 rounded-lg flex items-center justify-center shadow-lg
                ${input.trim() && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2">
            <p className="text-xs text-gray-400 px-4">
              按Enter发送，按Shift+Enter换行
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow; 