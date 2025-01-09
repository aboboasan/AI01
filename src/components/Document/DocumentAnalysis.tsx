import React, { useState, useRef } from 'react';
import { 
  DocumentArrowUpIcon,
  DocumentTextIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

interface AnalysisResult {
  type: string;
  content: string;
  recommendation: string;
}

const DocumentAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    // TODO: 实现实际的文件分析逻辑
    setTimeout(() => {
      setResult({
        type: '合同文件',
        content: '这是一份购房合同，主要条款包括...',
        recommendation: '建议关注以下几点：\n1. 付款条件和时间安排\n2. 违约责任条款\n3. 产权交割细节'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div
        className={`
          flex-1 border-2 border-dashed rounded-xl
          ${file ? 'border-primary-500' : 'border-gray-600'}
          transition-colors duration-200
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file && !result && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <DocumentArrowUpIcon className="h-16 w-16 mb-4" />
            <p className="mb-4">拖拽文件到这里，或者</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              选择文件
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        )}

        {file && !result && (
          <div className="h-full flex flex-col items-center justify-center">
            <DocumentTextIcon className="h-16 w-16 mb-4 text-primary-500" />
            <p className="text-white mb-2">{file.name}</p>
            <p className="text-gray-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="flex space-x-4">
              <Button
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                icon={<DocumentMagnifyingGlassIcon className="h-5 w-5" />}
              >
                开始分析
              </Button>
              <Button
                variant="outline"
                onClick={() => setFile(null)}
              >
                重新选择
              </Button>
            </div>
          </div>
        )}

        {result && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">文件分析结果</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">文件类型</h4>
                  <p className="text-gray-400">{result.type}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">主要内容</h4>
                  <p className="text-gray-400 whitespace-pre-wrap">{result.content}</p>
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">分析建议</h4>
                  <p className="text-gray-400 whitespace-pre-wrap">{result.recommendation}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
              >
                分析新文件
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis; 