import React, { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const ContractReview: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isAnalyzing) return;

    setIsAnalyzing(true);
    // TODO: 实现合同分析功能
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              合同智能审查
            </h2>
            <p className="text-gray-500">
              快速识别合同风险，提供专业审查意见
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                {!file ? (
                  <>
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 mb-4">
                      拖拽文件到此处或点击上传
                    </div>
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
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
                    <div className="font-medium mb-2">{file.name}</div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      移除文件
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">支持的文件格式</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Word文档 (.doc, .docx)</li>
                <li>• PDF文件 (.pdf)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`
                w-full py-3 rounded-lg flex items-center justify-center
                ${file && !isAnalyzing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isAnalyzing ? '分析中...' : '开始分析'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractReview; 