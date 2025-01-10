import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { analyzeContract, chatCompletion, ChatMessage } from '../../services/api';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Input } from '../common/Input';
const mammoth = require('mammoth');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ContractReview: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    try {
      if (selectedFile.name.endsWith('.txt')) {
        // 处理 txt 文件
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          setFileContent(content);
        };
        reader.onerror = () => {
          setError('文件读取失败，请重试');
          setFile(null);
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.name.endsWith('.docx')) {
        // 处理 docx 文件
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setFileContent(result.value);
      } else if (selectedFile.name.endsWith('.doc')) {
        setError('抱歉，暂不支持旧版 .doc 格式，请将文件转换为 .docx 格式后重试');
        setFile(null);
      } else {
        setError('不支持的文件格式');
        setFile(null);
      }
    } catch (error: any) {
      setError(error.message || '文件处理失败，请重试');
      setFile(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.doc,.docx';
      
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: { files: [droppedFile] }
      });
      
      await handleFileChange(event as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContent || isAnalyzing) return;

    setIsAnalyzing(true);
    setError('');
    try {
      const analysis = await analyzeContract(fileContent);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: '请分析这份合同的主要内容和潜在风险。',
        timestamp: new Date().toISOString()
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis,
        timestamp: new Date().toISOString()
      };

      setMessages([userMessage, assistantMessage]);
      scrollToBottom();
    } catch (error: any) {
      setError(error.message || '合同分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    setError('');

    try {
      const apiMessages: ChatMessage[] = [
        {
          role: 'system',
          content: '你是一位专业的合同审查专家，请基于之前的合同分析结果，回答用户的具体问题。'
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: input
        }
      ];

      const response = await chatCompletion(apiMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      scrollToBottom();
    } catch (error: any) {
      setError(error.message || 'API调用失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4">
              <ErrorMessage 
                message={error} 
                onClose={() => setError('')}
              />
            </div>
          )}
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              合同智能审查
            </h2>
            <p className="text-gray-500">
              快速识别合同风险，提供专业审查意见
            </p>
          </div>

          {!messages.length ? (
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-center">
                  {!file ? (
                    <>
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-gray-600 mb-4">
                        拖拽文件到此处或点击上传
                      </div>
                      <input
                        type="file"
                        accept=".txt,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="contract-file"
                      />
                      <label
                        htmlFor="contract-file"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        选择文件
                      </label>
                    </>
                  ) : (
                    <div className="text-gray-900">
                      <div className="font-medium mb-4">{file.name}</div>
                      <div className="flex justify-center space-x-6">
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="px-6 py-2.5 text-base font-medium text-red-600 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 transform active:scale-95"
                        >
                          移除文件
                        </button>
                        <button
                          type="submit"
                          disabled={isAnalyzing}
                          className={`px-6 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-200 transform active:scale-95 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isAnalyzing ? (
                            <div className="flex items-center">
                              <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                              分析中...
                            </div>
                          ) : (
                            '开始分析'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">支持的文件格式</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 文本文件 (.txt)</li>
                  <li>• Word文档 (.docx)</li>
                </ul>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg px-4 py-2 shadow`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {messages.length > 0 && (
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

export default ContractReview; 