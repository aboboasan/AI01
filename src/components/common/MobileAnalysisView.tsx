import React, { RefObject } from 'react';
import { FileInfo } from '../../types/file';
import { CloudArrowUpIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MobileAnalysisViewProps {
  file: FileInfo | null;
  isAnalyzing: boolean;
  analysisResult: string;
  onFileSelect: (file: File) => void;
  onPreview: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  file,
  isAnalyzing,
  analysisResult,
  onFileSelect,
  onPreview,
  fileInputRef,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 标题区域 */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">律师角度分析</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          资深律师为您从辩护角度分析案件，挖掘有利因素，制定最佳法律策略。
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!file && !analysisResult && (
          <div
            className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">点击上传案件文件</p>
            <p className="text-xs text-gray-400">支持 PDF、Word、文本文件</p>
          </div>
        )}

        {file && !analysisResult && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-900 dark:text-white">已选择文件</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>文件名：{file.name}</p>
              <p>大小：{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>上传时间：{new Date(file.uploadTime).toLocaleString()}</p>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {analysisResult}
              </pre>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">正在分析案件，预计需要1-2分钟...</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="grid grid-cols-5 gap-1 p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudArrowUpIcon className="w-6 h-6" />
          <span className="text-xs mt-1">上传案件</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={onPreview}
          disabled={!file}
        >
          <DocumentMagnifyingGlassIcon className="w-6 h-6" />
          <span className="text-xs mt-1">预览</span>
        </button>

        <button
          className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={() => {/* 开始分析 */}}
          disabled={!file || isAnalyzing}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">开始分析</span>
        </button>

        <button
          className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={() => {/* 重新开始 */}}
          disabled={!analysisResult}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs mt-1">重新开始</span>
        </button>

        <button
          className="flex flex-col items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
          onClick={() => {/* 下载报告 */}}
          disabled={!analysisResult}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-xs mt-1">下载报告</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
      />
    </div>
  );
};

export default MobileAnalysisView; 