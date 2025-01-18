import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { analyzeLawyerCase } from '../../services/api';
import mammoth from 'mammoth';
import PreviewPage from '../common/PreviewPage';
import MobileAnalysisView from '../common/MobileAnalysisView';
import MobileActionButtons from '../common/MobileActionButtons';
import { FileInfo } from '../../types/file';

const LawyerAnalysis: React.FC = () => {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file) {
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toISOString()
      };
      setFile(fileInfo);
      setAnalysisResult('');
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile({
        file: droppedFile,
        name: droppedFile.name,
        size: droppedFile.size,
        type: droppedFile.type,
        uploadTime: new Date().toLocaleString()
      });
      setAnalysisResult('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      // 处理PDF文件
      // 这里需要实现PDF文本提取逻辑
      return ''; // 临时返回空字符串
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      // 处理Word文档
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (file.type === 'text/plain') {
      // 处理纯文本文件
      return await file.text();
    } else {
      throw new Error('不支持的文件格式');
    }
  };

  const analyzeLawyer = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const text = await extractTextFromFile(file.file);
      const response = await analyzeLawyerCase(text);
      setAnalysisResult(response);
    } catch (error) {
      console.error('案件分析失败:', error);
      setAnalysisResult('案件分析失败，请重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadAnalysis = () => {
    if (!analysisResult) return;

    const blob = new Blob([analysisResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `律师分析报告_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const mobileActions = [
    {
      icon: <CloudArrowUpIcon className="w-6 h-6" />,
      label: '上传案件',
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: <DocumentMagnifyingGlassIcon className="w-6 h-6" />,
      label: '开始分析',
      onClick: analyzeLawyer,
      disabled: !file || isAnalyzing,
    },
    {
      icon: <ArrowPathIcon className="w-6 h-6" />,
      label: '重新开始',
      onClick: resetAnalysis,
      disabled: !file,
    },
    {
      icon: <ArrowDownTrayIcon className="w-6 h-6" />,
      label: '下载报告',
      onClick: downloadAnalysis,
      disabled: !analysisResult,
    },
  ];

  if (showPreview) {
    return <PreviewPage content={analysisResult} onBack={() => setShowPreview(false)} />;
  }

  return (
    <div className="h-full">
      <div className="lg:hidden">
        <MobileAnalysisView
          file={file}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onFileSelect={handleFileChange}
          onPreview={() => setShowPreview(true)}
          onAnalyze={analyzeLawyer}
          onReset={resetAnalysis}
          onDownload={downloadAnalysis}
          fileInputRef={fileInputRef}
        />
      </div>

      <div className="hidden lg:flex h-full space-x-6">
        {/* 左侧面板：文件上传区域 */}
        <div className="w-1/2 flex flex-col space-y-4">
          <div
            className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center space-y-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!file ? (
              <>
                <DocumentMagnifyingGlassIcon className="w-16 h-16 text-gray-400" />
                <div className="text-center">
                  <p className="text-gray-600">拖拽文件到这里，或者</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    点击上传
                  </button>
                </div>
                <p className="text-sm text-gray-500">支持 PDF、Word、TXT 格式</p>
              </>
            ) : (
              <>
                <DocumentMagnifyingGlassIcon className="w-12 h-12 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    大小：{(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-500">
                    上传时间：{file.uploadTime}
                  </p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleInputChange}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={analyzeLawyer}
              disabled={!file || isAnalyzing}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-white ${
                !file || isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  开始分析
                </>
              )}
            </button>
            <button
              onClick={resetAnalysis}
              disabled={!file}
              className={`px-4 py-2 rounded-lg ${
                !file
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 右侧面板：分析结果 */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">分析结果</h2>
            {analysisResult && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadAnalysis}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            {analysisResult ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {analysisResult}
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>正在分析案件，请稍候...</span>
                  </div>
                ) : (
                  <span>上传案件文件开始分析</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAnalysis; 