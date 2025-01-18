import React, { RefObject } from 'react';
import { FileInfo } from '../../types/file';
import { CloudArrowUpIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface MobileAnalysisViewProps {
  file: FileInfo | null;
  isAnalyzing: boolean;
  analysisResult: string;
  onFileSelect: (file: File) => void;
  onPreview: () => void;
  onAnalyze: () => void;
  onReset: () => void;
  onDownload: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  file,
  isAnalyzing,
  analysisResult,
  onFileSelect,
  onPreview,
  onAnalyze,
  onReset,
  onDownload,
  fileInputRef,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* 标题区域 */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">律师角度分析</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          资深律师为您从辩护角度分析案件，挖掘有利因素，制定最佳法律策略。
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!file && !analysisResult && (
          <div
            className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudArrowUpIcon className="w-10 h-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">点击上传案件文件</p>
            <p className="text-xs text-gray-400">支持 PDF、Word、文本文件</p>
          </div>
        )}

        {file && !analysisResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <CloudArrowUpIcon className="w-8 h-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{new Date(file.uploadTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={onReset}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  重新选择
                </button>
                <button
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:bg-gray-400"
                >
                  {isAnalyzing ? '分析中...' : '开始分析'}
                </button>
              </div>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">分析结果</h3>
              <div className="flex space-x-2">
                <button
                  onClick={onPreview}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={onDownload}
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {analysisResult}
              </pre>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">正在分析案件</p>
                  <p className="mt-1 text-xs text-gray-500">预计需要1-2分钟...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
        <button
          className="flex flex-col items-center justify-center py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudArrowUpIcon className="w-6 h-6" />
          <span className="text-xs mt-1">上传案件</span>
        </button>
        
        <button
          className="flex flex-col items-center justify-center py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          onClick={onAnalyze}
          disabled={!file || isAnalyzing}
        >
          <DocumentMagnifyingGlassIcon className="w-6 h-6" />
          <span className="text-xs mt-1">开始分析</span>
        </button>

        <button
          className="flex flex-col items-center justify-center py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          onClick={onReset}
          disabled={!file}
        >
          <ArrowPathIcon className="w-6 h-6" />
          <span className="text-xs mt-1">重新开始</span>
        </button>

        <button
          className="flex flex-col items-center justify-center py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          onClick={onDownload}
          disabled={!analysisResult}
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
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