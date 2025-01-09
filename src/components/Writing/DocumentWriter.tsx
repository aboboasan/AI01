import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const DocumentWriter: React.FC = () => {
  const [documentType, setDocumentType] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const documentTypes = [
    { id: 'complaint', name: '起诉状' },
    { id: 'defense', name: '答辩状' },
    { id: 'appeal', name: '上诉状' },
    { id: 'contract', name: '合同' },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentType || !content.trim() || isGenerating) return;

    setIsGenerating(true);
    // TODO: 实现文书生成功能
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              智能文书生成
            </h2>
            <p className="text-gray-500">
              快速生成专业的法律文书
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择文书类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocumentType(type.id)}
                    className={`
                      p-4 rounded-lg border text-left
                      ${documentType === type.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <DocumentTextIcon className="h-6 w-6 text-gray-400 mb-2" />
                    <div className="font-medium">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                案件描述
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请详细描述案件情况..."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              disabled={!documentType || !content.trim() || isGenerating}
              className={`
                w-full py-3 rounded-lg flex items-center justify-center
                ${documentType && content.trim() && !isGenerating
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? '生成中...' : '生成文书'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentWriter; 