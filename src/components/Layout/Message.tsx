import React from 'react';

interface MessageProps {
  content: string;
  isUser?: boolean;
  timestamp?: string;
  status?: 'sending' | 'sent' | 'error';
}

const Message: React.FC<MessageProps> = ({
  content,
  isUser = false,
  timestamp,
  status = 'sent'
}) => {
  // 简单的文本格式化
  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        max-w-[85%] 
        ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}
        rounded-lg shadow-sm
        ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}
        overflow-hidden
      `}>
        {/* 消息内容 */}
        <div className="p-4">
          <div className="whitespace-pre-wrap break-words">
            {formatContent(content)}
          </div>
        </div>

        {/* 消息状态和时间戳 */}
        <div className={`
          px-4 py-1 text-xs
          ${isUser ? 'text-blue-200' : 'text-gray-500'}
          flex items-center justify-end
          border-t ${isUser ? 'border-blue-500' : 'border-gray-100'}
        `}>
          {status === 'sending' && (
            <span className="mr-2">发送中...</span>
          )}
          {status === 'error' && (
            <span className="mr-2 text-red-500">发送失败</span>
          )}
          {timestamp && (
            <time>{timestamp}</time>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 