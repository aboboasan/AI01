import React from 'react';
import { Message } from './types';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-3xl`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <UserCircleIcon className="h-8 w-8 text-primary-500" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
          )}
        </div>
        <div className={`mx-3 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`
            inline-block rounded-lg px-4 py-2
            ${isUser ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-100'}
          `}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 