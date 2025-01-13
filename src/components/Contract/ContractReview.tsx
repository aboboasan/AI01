import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { chatCompletion, ChatMessage } from '../../services/api';
import mammoth from 'mammoth';

interface ReviewResult {
  risks: string[];
  suggestions: string[];
  score: number;
  summary: string;
  keyPoints: string[];
}

const ContractReview: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviewResult, setReviewResult] = useState<ReviewResult>({
    risks: [],
    suggestions: [],
    score: 0,
    summary: '',
    keyPoints: []
  });

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

    // 检查文件大小（限制为 10MB）
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
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

      // 处理不同类型的文件
      if (file.type === 'text/plain') {
        // 文本文件直接读取
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
        // Word 文档需要特殊处理
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
      } else if (file.type === 'application/pdf') {
        // PDF 文件暂时不支持
        reject(new Error('暂不支持 PDF 文件，请上传 Word 或文本文件'));
      } else {
        reject(new Error('不支持的文件格式'));
      }
    });
  };

  const handleAnalyze = async () => {
    if (!fileContent || isAnalyzing) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `作为您的合同审查专家，我将从保护您权益的角度全面审查合同：

1. 利益维护：重点识别和分析可能损害您权益的条款
2. 风险预警：全面排查潜在法律风险和商业风险
3. 公平性：评估合同条款的公平性和合理性
4. 完整性：检查必要条款是否完备，措辞是否严谨
5. 实操性：评估合同条款的可执行性和履约风险

我将重点关注：
- 合同主体资格和权限
- 权利义务是否对等
- 责任划分是否明确
- 违约责任和救济措施
- 争议解决机制
- 特殊条款（保密、竞业、知识产权等）

分析结果将包含：
[摘要]
对合同的整体评价和主要特点

[关键条款]
需要特别关注的条款清单

[风险提示]
可能存在的法律和商业风险

[改进建议]
具体的修改和完善建议

[评分]
基于对您权益保护的综合评分(0-100)`
        },
        {
          role: 'user',
          content: fileContent
        }
      ];

      const response = await chatCompletion(messages);
      
      // 解析返回结果
      const { content } = response;
      const summary = content.match(/\[摘要\]([\s\S]*?)\[关键条款\]/)?.[1].trim() || '';
      const keyPoints = content.match(/\[关键条款\]([\s\S]*?)\[风险提示\]/)?.[1].split('-').filter(Boolean).map((s: string) => s.trim()) || [];
      const risks = content.match(/\[风险提示\]([\s\S]*?)\[改进建议\]/)?.[1].split('-').filter(Boolean).map((s: string) => s.trim()) || [];
      const suggestions = content.match(/\[改进建议\]([\s\S]*?)\[评分\]/)?.[1].split('-').filter(Boolean).map((s: string) => s.trim()) || [];
      const score = parseInt(content.match(/\[评分\]\s*(\d+)/)?.[1] || '0');

      setReviewResult({
        risks,
        suggestions,
        score,
        summary,
        keyPoints
      });
    } catch (error) {
      console.error('合同审查失败:', error);
      setError('审查失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* 欢迎区域 */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <DocumentMagnifyingGlassIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              智能合同审查
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              上传合同文件，我们将为您分析合同条款，识别潜在风险，提供专业建议
            </p>
          </div>

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
                    <div className="text-gray-700 font-medium mb-2">
                      {isDragging ? '释放文件以上传' : '拖拽文件到此处或点击上传'}
                    </div>
                    <div className="text-sm text-gray-500">
                      支持 .txt、.doc、.docx 格式，最大 10MB
                    </div>
                  </>
                ) : (
                  <div className="text-gray-900">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                      <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="font-medium mb-2">{file.name}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileContent('');
                        setReviewResult({
                          risks: [],
                          suggestions: [],
                          score: 0,
                          summary: '',
                          keyPoints: []
                        });
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
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
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
                  <span className="font-medium">分析中...</span>
                </>
              ) : (
                <>
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                  <span className="font-medium">开始分析</span>
                </>
              )}
            </button>
          </div>

          {/* 分析结果 */}
          {reviewResult.summary && (
            <div className="space-y-6">
              {/* 合同摘要 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  合同摘要
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {reviewResult.summary}
                </p>
              </div>

              {/* 关键条款 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                  关键条款
                </h3>
                <div className="space-y-3">
                  {reviewResult.keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-yellow-800">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 风险提示 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                  风险提示
                </h3>
                <div className="space-y-3">
                  {reviewResult.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100"
                    >
                      <svg className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-red-800">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 改进建议 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  改进建议
                </h3>
                <div className="space-y-3">
                  {reviewResult.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100"
                    >
                      <svg className="h-6 w-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 合同评分 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  合同评分
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeDasharray={`${reviewResult.score}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {reviewResult.score}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">合同质量评分</div>
                    <div className="text-lg font-medium text-gray-900">
                      {reviewResult.score >= 90 ? '优秀' :
                       reviewResult.score >= 80 ? '良好' :
                       reviewResult.score >= 60 ? '一般' : '需改进'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractReview; 