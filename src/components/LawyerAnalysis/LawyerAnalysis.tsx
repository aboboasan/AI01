import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { analyzeLawyerCase } from '../../services/api';
import mammoth from 'mammoth';
import PreviewPage from '../CaseAnalysis/PreviewPage';
import MobileAnalysisView from '../common/MobileAnalysisView';
import MobileActionButtons from '../common/MobileActionButtons';

const LawyerAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreviewPage, setShowPreviewPage] = useState(false);

  // 添加移动端检测
  const isMobile = window.innerWidth <= 768;

  const handleFile = async (selectedFile: File) => {
    // 检查文件类型
    const allowedTypes = [
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('请上传 .txt、.doc 或 .docx 格式的文件');
      return;
    }

    // 检查文件大小（限制为 20MB）
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('文件大小不能超过 20MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    try {
      const content = await readFileContent(selectedFile);
      if (typeof content !== 'string' || content.length === 0) {
        throw new Error('无法读取文件内容');
      }
      setFileContent(content);
    } catch (error) {
      console.error('读取文件失败:', error);
      setError(error instanceof Error ? error.message : '文件读取失败，请重试');
      setFile(null);
      setFileContent('');
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await handleFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleFile(selectedFile);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type === 'text/plain') {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.onerror = (e) => {
          reject(new Error('读取文本文件失败'));
        };
        reader.readAsText(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
      ) {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            resolve(result.value);
          } catch (error) {
            reject(new Error('读取 Word 文档失败'));
          }
        };
        reader.onerror = (e) => {
          reject(new Error('读取 Word 文档失败'));
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('不支持的文件格式'));
      }
    });
  };

  const handleAnalyze = async () => {
    if (!file || !fileContent) {
      setError('请先上传文件');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      console.log('开始分析文件内容:', fileContent.substring(0, 100) + '...');
      
      const result = await analyzeLawyerCase(fileContent);
      console.log('分析结果:', result);

      if (!result) {
        throw new Error('分析结果为空');
      }

      setAnalysisResult(result);
      console.log('分析结果已设置');
    } catch (error) {
      console.error('案件分析失败:', error);
      setError(error instanceof Error ? error.message : '案件分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePreview = () => {
    if (analysisResult) {
      setShowPreviewPage(true);
    }
  };

  const handleDownload = () => {
    if (!analysisResult) return;
    
    const blob = new Blob([analysisResult], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '律师分析报告.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (showPreviewPage && analysisResult) {
    return (
      <PreviewPage
        content={analysisResult}
        onBack={() => setShowPreviewPage(false)}
      />
    );
  }

  if (analysisResult && isMobile) {
    return (
      <>
        <MobileAnalysisView
          title="律师角度分析"
          description="资深律师为您分析案件要素，制定最佳策略"
          content={analysisResult}
          onBack={() => setAnalysisResult('')}
        />
        <MobileActionButtons
          onPreview={handlePreview}
          onDownload={handleDownload}
          showPreview={!!analysisResult}
          showDownload={!!analysisResult}
        />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 固定在顶部的欢迎区域 */}
      <div className="bg-gray-50 py-4 px-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            律师角度分析
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            资深律师为您从辩护角度分析案件，挖掘有利因素，制定最佳法律策略。我们将全面审查案件材料，为您提供专业的法律分析和具体的策略建议。
          </p>
        </div>
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* 文件上传区域 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                ${isDragging 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
                ${error ? 'border-red-300' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-center">
                {!file ? (
                  <>
                    <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                      <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-gray-700 font-medium mb-2 text-sm">
                      {isDragging ? '释放文件以上传' : '拖拽文件到此处或点击上传'}
                    </div>
                    <div className="text-xs text-gray-500">
                      支持 .txt、.doc、.docx 格式，最大 20MB
                    </div>
                  </>
                ) : (
                  <div className="text-gray-900">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                      <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="font-medium mb-2 text-sm">{file.name}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileContent('');
                        setAnalysisResult('');
                      }}
                      className="text-sm text-red-600 hover:text-red-500 font-medium"
                    >
                      移除文件
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {file && fileContent && (
              <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">文件已成功读取，可以开始分析</span>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!fileContent || isAnalyzing}
              className={`
                w-full mt-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all
                ${fileContent && !isAnalyzing
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span className="font-medium text-sm">分析中...</span>
                </>
              ) : (
                <>
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                  <span className="font-medium text-sm">开始分析</span>
                </>
              )}
            </button>
          </div>

          {/* 分析结果 */}
          {analysisResult && analysisResult.length > 0 && (
            <>
              {/* 操作按钮组 */}
              <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-2 flex justify-end gap-4">
                  <button
                    onClick={() => setShowPreviewPage(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <EyeIcon className="h-5 w-5" />
                    预览报告
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    下载报告
                  </button>
                </div>
              </div>

              {/* 分析结果显示 */}
              <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-12">
                  <div className="space-y-6">
                    {/* 折叠面板模式 */}
                    {analysisResult.split('【').map((section, index) => {
                      if (index === 0) return null;
                      
                      const titleMatch = section.match(/([^】]+)】([\s\S]+?)(?=【|$)/);
                      if (!titleMatch) return null;
                      
                      const [_, title, content] = titleMatch;
                      if (!content.trim()) return null;
                      
                      return (
                        <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <details open>
                            <summary className="flex items-center mb-4 cursor-pointer">
                              <div className="w-1 h-6 bg-blue-500 mr-2"></div>
                              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            </summary>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap pl-6 space-y-2">
                              {content.trim()}
                            </div>
                          </details>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 移动端操作按钮 */}
      {isMobile && analysisResult && (
        <MobileActionButtons
          onPreview={handlePreview}
          onDownload={handleDownload}
          showPreview={!!analysisResult}
          showDownload={!!analysisResult}
        />
      )}
    </div>
  );
};

export default LawyerAnalysis; 