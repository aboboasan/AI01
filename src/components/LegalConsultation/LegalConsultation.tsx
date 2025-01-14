import React, { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import ChatWindow from '../Chat/ChatWindow';
import MobileChatView from '../Chat/MobileChatView';
import { Message } from '../../types/chat';
import { chatCompletion } from '../../services/api';

const LegalConsultation: React.FC = () => {
  const systemMessage: Message = {
    id: 'system',
    role: 'system',
    content: '作为一名20年经验丰富的私人金牌律师，我不仅回答你法律专业的各种问题，同时我还能回复你一切的问题。我们就像老朋友一样。无话不谈。没有障碍，没有壁垒，但是我会站在你的角度思考任何问题。维护你的利益和权益。',
    timestamp: new Date().toISOString()
  };

  const [messages, setMessages] = useState<Message[]>([systemMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('56px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
      setTextareaHeight(scrollHeight + 'px');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    adjustTextareaHeight();

    try {
      const apiMessages = messages.map(({ role, content }) => ({ role, content }));
      apiMessages.push({ role: userMessage.role, content: userMessage.content });
      
      const response = await chatCompletion(apiMessages);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: error instanceof Error ? error.message : '获取回复时出现错误，请稍后重试。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // 在移动端处理返回操作
  };

  return isMobile ? (
    <MobileChatView
      messages={messages}
      input={input}
      isLoading={isLoading}
      textareaHeight={textareaHeight}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      onBack={handleBack}
      textareaRef={textareaRef}
    />
  ) : (
    <ChatWindow
      messages={messages}
      input={input}
      isLoading={isLoading}
      textareaHeight={textareaHeight}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      textareaRef={textareaRef}
    />
  );
};

export default LegalConsultation; 