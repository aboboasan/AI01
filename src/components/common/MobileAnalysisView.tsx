import React, { RefObject } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
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
    <div className="p-4">
      {/* 文件上传区域 */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={onFileSelect}
        />
        {file ? (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              大小：{(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-500">
              上传时间：{file.uploadTime}
            </p>
          </div>
        ) : null}
      </div>

      {/* 分析结果 */}
      {analysisResult && (
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-900 bg-gray-50 hover:bg-gray-100">
                    <span className="font-medium">分析结果</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-3">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {analysisResult}
                    </pre>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isAnalyzing && (
        <div className="mt-4 flex items-center justify-center text-gray-500">
          <svg
            className="animate-spin h-5 w-5 mr-2"
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
          正在分析，请稍候...
        </div>
      )}
    </div>
  );
};

export default MobileAnalysisView; 