import React, { useState } from 'react';
import { DocumentTextIcon, ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { chatCompletion, ChatMessage } from '../../services/api';

interface FormData {
  documentType: string;
  partyInfo: string;
  caseInfo: string;
  claims: string;
}

const documentTypes = [
  { id: '起诉状', name: '起诉状', description: '向法院提起诉讼的书面文书' },
  { id: '答辩状', name: '答辩状', description: '对原告起诉请求进行答辩的书面文书' },
  { id: '上诉状', name: '上诉状', description: '不服一审判决向上级法院提起上诉的文书' },
  { id: '仲裁申请书', name: '仲裁申请书', description: '向仲裁机构申请仲裁的书面文书' },
  { id: '和解协议', name: '和解协议', description: '双方达成和解的书面协议' },
  { id: '民事调解书', name: '民事调解书', description: '经法院调解达成的协议文书' }
];

const DocumentWriter: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    partyInfo: '',
    caseInfo: '',
    claims: ''
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.documentType || !formData.partyInfo.trim() || !formData.caseInfo.trim() || !formData.claims.trim()) {
      setError('请填写完整的文书信息');
      return;
    }
    
    setIsGenerating(true);
    setError('');

    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `作为您的专业法律文书撰写助手，我将帮助您生成最有利于维护您权益的法律文书：

1. 权益保护：确保文书最大程度维护您的合法权益
2. 专业规范：严格遵循法律文书的格式规范和用语要求
3. 论据充分：援引相关法律法规，强化文书说服力
4. 重点突出：清晰表达诉求，突出对您有利的关键点
5. 严谨完整：确保文书要素完整，表述严谨准确

我将：
- 根据您提供的信息，选择最合适的文书模板
- 使用最新的法律依据支持您的诉求
- 突出对您有利的事实和证据
- 采用最有说服力的论述方式
- 确保文书格式规范，用语专业

请提供案件相关信息，我会为您生成最专业的法律文书。`
        },
        {
          role: 'user',
          content: `
            文书类型：${formData.documentType}
            当事人信息：${formData.partyInfo}
            案件事实：${formData.caseInfo}
            诉讼请求：${formData.claims}
          `
        }
      ];

      setIsGenerating(true);
      setError('');
      
      const response = await chatCompletion(messages);
      const { content } = response;
      setGeneratedContent(content);
    } catch (error) {
      console.error('文书生成失败:', error);
      setError('生成文书时出现错误，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        const copyButton = document.getElementById('copy-button');
        if (copyButton) {
          copyButton.textContent = '已复制';
          setTimeout(() => {
            copyButton.textContent = '复制文书';
          }, 2000);
        }
      })
      .catch(() => setError('复制失败，请手动复制'));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* 欢迎区域 */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <DocumentTextIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              智能文书生成
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              选择文书类型，填写相关信息，快速生成规范的法律文书
            </p>
          </div>

          {/* 表单区域 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="space-y-6">
              {/* 文书类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文书类型
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {documentTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`
                        relative flex flex-col p-4 cursor-pointer rounded-xl border transition-all
                        ${formData.documentType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="documentType"
                        value={type.id}
                        checked={formData.documentType === type.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.name}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        {type.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 当事人信息 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当事人信息
                </label>
                <textarea
                  name="partyInfo"
                  value={formData.partyInfo}
                  onChange={handleInputChange}
                  placeholder="请输入当事人的基本信息，包括姓名、身份证号、联系方式等..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  rows={4}
                />
              </div>

              {/* 案件事实 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案件事实
                </label>
                <textarea
                  name="caseInfo"
                  value={formData.caseInfo}
                  onChange={handleInputChange}
                  placeholder="请详细描述案件的基本事实、经过和相关证据..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  rows={6}
                />
              </div>

              {/* 诉讼请求 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  诉讼请求
                </label>
                <textarea
                  name="claims"
                  value={formData.claims}
                  onChange={handleInputChange}
                  placeholder="请输入具体的诉讼请求或主张..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  rows={4}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`
                  w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all
                  ${!isGenerating
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    <span className="font-medium">生成中...</span>
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="h-5 w-5" />
                    <span className="font-medium">生成文书</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 生成结果 */}
          {generatedContent && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  生成结果
                </h3>
                <button
                  id="copy-button"
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors gap-2"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  复制文书
                </button>
              </div>
              <div className="prose prose-gray max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-6 border border-gray-100">
                  {generatedContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentWriter; 