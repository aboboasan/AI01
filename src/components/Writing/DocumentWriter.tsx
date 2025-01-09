import React, { useState } from 'react';
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { chatCompletion } from '../../services/api';

interface FormData {
  documentType: string;
  partyInfo: string;
  caseInfo: string;
  claims: string;
}

const DocumentWriter: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    partyInfo: '',
    caseInfo: '',
    claims: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  const documentTypes = [
    { id: 'complaint', name: '起诉状', description: '向法院提起诉讼的法律文书' },
    { id: 'defense', name: '答辩状', description: '对原告起诉请求进行答辩的法律文书' },
    { id: 'appeal', name: '上诉状', description: '不服一审判决向上级法院提起上诉的法律文书' },
    { id: 'statement', name: '陈述意见', description: '对案件相关事实和证据发表意见的法律文书' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const generatePrompt = (data: FormData) => {
    const documentTypeText = documentTypes.find(type => type.id === data.documentType)?.name || data.documentType;
    
    return `请帮我起草一份${documentTypeText}，具体信息如下：
当事人信息：${data.partyInfo}
案件事实与理由：${data.caseInfo}
诉讼请求：${data.claims}

请按照以下要求起草：
1. 严格遵守中国法律文书的格式规范
2. 使用正式的法律术语和表达方式
3. 确保文书结构完整，包括标题、正文和落款等必要部分
4. 根据提供的案件事实和理由，引用相关法律条款
5. 语言要准确、严谨、专业

请直接生成文书内容，无需其他解释。`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.documentType) {
      setError('请选择文书类型');
      return;
    }
    if (!formData.partyInfo.trim()) {
      setError('请填写当事人信息');
      return;
    }
    if (!formData.caseInfo.trim()) {
      setError('请填写案件事实与理由');
      return;
    }
    if (!formData.claims.trim()) {
      setError('请填写诉讼请求');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = generatePrompt(formData);
      const response = await chatCompletion([
        {
          role: 'system',
          content: '你是一位专业的中国法律文书起草专家，精通各类法律文书的格式规范和写作要求。请严格按照中国法律文书的标准格式进行写作。'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      setGeneratedContent(response.content);
    } catch (err) {
      console.error('生成文书时出错:', err);
      setError('生成文书时出现错误，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => alert('已复制到剪贴板'))
      .catch(() => alert('复制失败，请手动复制'));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              智能文书生成
            </h2>
            <p className="text-gray-500">
              快速生成专业的法律文书
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 文书类型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择文书类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                {documentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('documentType', type.id)}
                    className={`
                      p-4 rounded-lg border text-left transition-colors
                      ${formData.documentType === type.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <DocumentTextIcon className="h-6 w-6 text-gray-400 mb-2" />
                    <div className="font-medium mb-1">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 当事人信息 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当事人信息
              </label>
              <textarea
                value={formData.partyInfo}
                onChange={(e) => handleInputChange('partyInfo', e.target.value)}
                placeholder="请填写当事人的基本信息（姓名/名称、住所地等）..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* 案件事实与理由 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                案件事实与理由
              </label>
              <textarea
                value={formData.caseInfo}
                onChange={(e) => handleInputChange('caseInfo', e.target.value)}
                placeholder="请详细描述案件的基本事实和法律依据..."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* 诉讼请求 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                诉讼请求
              </label>
              <textarea
                value={formData.claims}
                onChange={(e) => handleInputChange('claims', e.target.value)}
                placeholder="请列明具体的诉讼请求..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* 生成按钮 */}
            <button
              type="submit"
              disabled={isGenerating}
              className={`
                w-full py-3 rounded-lg flex items-center justify-center space-x-2
                ${isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <span>生成文书</span>
              )}
            </button>
          </form>

          {/* 生成结果 */}
          {generatedContent && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">生成结果</h3>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  复制内容
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-800 font-mono">
                {generatedContent}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentWriter; 