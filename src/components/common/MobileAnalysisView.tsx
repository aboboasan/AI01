import React, { RefObject } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { FileInfo } from '../../types/file';

interface MobileAnalysisViewProps {
  file: FileInfo | null;
  isAnalyzing: boolean;
  analysisResult: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  file,
  isAnalyzing,
  analysisResult,
  onFileSelect,
  fileInputRef,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 标题区域 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">律师角度分析</h2>
        <p className="mt-1 text-sm text-gray-500">
          资深律师为您从辩护角度分析案件，挖掘有利因素，制定最佳法律策略。
        </p>
      </div>

      {/* 文件上传区域 */}
      <div className="px-4 py-3">
        <div 
          className={`p-4 rounded-lg border ${
            file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          } flex items-center space-x-3 shadow-sm`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={onFileSelect}
          />
          
          <div className="flex-shrink-0">
            <CloudArrowUpIcon className={`w-8 h-8 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            {file ? (
              <>
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{file.uploadTime}</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900">点击上传案件文件</p>
                <p className="text-xs text-gray-500 mt-0.5">支持 PDF、Word、TXT 格式</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 分析结果 */}
      {analysisResult && (
        <div className="flex-1 px-4 py-3 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-900 bg-gray-50 hover:bg-gray-100">
                    <div>
                      <span className="font-medium">分析结果</span>
                      <span className="ml-2 text-sm text-gray-500">点击展开/收起</span>
                    </div>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                        {analysisResult}
                      </pre>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isAnalyzing && (
        <div className="flex-1 flex items-center justify-center bg-white bg-opacity-90">
          <div className="flex flex-col items-center px-4 py-8">
            <svg
              className="animate-spin h-8 w-8 mb-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">正在分析案件，请稍候...</p>
            <p className="mt-1 text-sm text-gray-500">预计需要1-2分钟</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAnalysisView; 