import React, { useState } from 'react';
import {
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

const documentTypes = [
  { id: 'complaint', name: '起诉状' },
  { id: 'defense', name: '答辩状' },
  { id: 'appeal', name: '上诉状' },
  { id: 'contract', name: '合同' },
  { id: 'will', name: '遗嘱' },
  { id: 'power_of_attorney', name: '授权委托书' }
];

interface FormData {
  documentType: string;
  parties: string;
  facts: string;
  requirements: string;
}

const LegalWriting: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    documentType: '',
    parties: '',
    facts: '',
    requirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // TODO: 实现实际的文书生成逻辑
    setTimeout(() => {
      setGeneratedContent(`
北京市朝阳区人民法院：

原告张三，男，汉族，1980年1月1日出生，住址：北京市朝阳区...
身份证号：110105198001010000

被告李四，男，汉族，1982年2月2日出生，住址：北京市海淀区...
身份证号：110108198202020000

诉讼请求：
1. 判令被告支付货款人民币100000元；
2. 本案诉讼费用由被告承担。

事实与理由：
2023年1月1日，原告与被告签订《购销合同》一份...

此致
北京市朝阳区人民法院

具状人：张三
年 月 日
      `.trim());
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleReset = () => {
    setFormData({
      documentType: '',
      parties: '',
      facts: '',
      requirements: ''
    });
    setGeneratedContent('');
  };

  return (
    <div className="h-full flex">
      <div className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              文书类型
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
              required
            >
              <option value="">选择文书类型</option>
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              当事人信息
            </label>
            <textarea
              name="parties"
              value={formData.parties}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 h-24"
              placeholder="请输入当事人的基本信息..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              事实与理由
            </label>
            <textarea
              name="facts"
              value={formData.facts}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 h-32"
              placeholder="请详细描述案件事实与理由..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              诉讼请求/具体要求
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 h-24"
              placeholder="请输入具体诉讼请求或要求..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              isLoading={isGenerating}
              className="flex-1"
            >
              生成文书
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              icon={<ArrowPathIcon className="h-5 w-5" />}
            >
              重置
            </Button>
          </div>
        </form>
      </div>

      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">生成结果</h3>
          {generatedContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              icon={copied ? <CheckCircleIcon className="h-5 w-5" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
            >
              {copied ? '已复制' : '复制文本'}
            </Button>
          )}
        </div>
        
        {generatedContent ? (
          <div className="bg-gray-700 rounded-lg p-6">
            <pre className="text-gray-200 whitespace-pre-wrap font-mono text-sm">
              {generatedContent}
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>生成的文书将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalWriting; 