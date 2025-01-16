import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Message } from '../Chat/types';
import { chatCompletion } from '../../services/api';
import mammoth from 'mammoth';
import PreviewPage from './PreviewPage';
import MobileAnalysisView from '../common/MobileAnalysisView';
import MobileActionButtons from '../common/MobileActionButtons';
import { useTheme } from '../../context/ThemeContext';

const systemMessage: Message = {
  id: 'system',
  role: 'system',
  content: `作为一名拥有20年经验的资深合同审查专家，我将基于您提供的合同文件进行专业分析。请严格按照以下格式输出分析结果：

【合同基本信息】
- 合同名称：[提取合同标题]
- 合同类型：[分析合同性质类型]
- 签约主体：
  · 甲方：[提取甲方名称及资格]
  · 乙方：[提取乙方名称及资格]
- 签订时间：[提取签订日期]
- 合同金额：[提取合同金额]
- 履行期限：[提取履行起止时间]

【主要条款审查】
1. 合同标的
- 标的内容：[分析合同标的具体内容]
- 存在问题：[列举标的条款存在的问题]
- 完善建议：[给出完善建议]

2. 权利义务
- 甲方主要义务：[提取并列举甲方义务]
- 乙方主要义务：[提取并列举乙方义务]
- 权责是否对等：[分析权责对等性]
- 需要补充：[给出补充建议]

3. 价款与支付
- 定价依据：[分析定价合理性]
- 支付方式：[分析支付条件和方式]
- 风险提示：[指出支付环节风险]
- 优化建议：[给出优化建议]

4. 违约责任
- 违约情形：[列举违约情形]
- 责任承担：[分析责任分配]
- 存在问题：[指出问题]
- 完善建议：[给出建议]

【重大风险提示】
1. 法律风险
- 风险等级：[评估等级：高/中/低]
- 风险点：[具体描述法律风险]
- 防范建议：[给出防范建议]

2. 商业风险
- 风险等级：[评估等级：高/中/低]
- 风险点：[具体描述商业风险]
- 防范建议：[给出防范建议]

3. 履约风险
- 风险等级：[评估等级：高/中/低]
- 风险点：[具体描述履约风险]
- 防范建议：[给出防范建议]

【合规性分析】
- 法律合规：[判断：合规/待完善/不合规]
- 行业标准：[判断：符合/部分符合/不符合]
- 主要问题：[说明合规问题]
- 整改建议：[给出整改建议]

【修改建议】
1. 必须修改
- [指出必须修改的条款序号和具体修改建议]
- [指出必须修改的条款序号和具体修改建议]

2. 建议优化
- [指出建议优化的条款序号和优化建议]
- [指出建议优化的条款序号和优化建议]

【总体评估】
- 合同效力：[判断：有效/待完善/存在重大缺陷]
- 整体风险：[评估：高/中/低]
- 签约建议：[给出：可以签署/完善后签署/不建议签署]
- 重点提示：[列出核心注意事项]`,
  timestamp: new Date().toISOString()
};

export const ContractReview: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showPreviewPage, setShowPreviewPage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const response = await chatCompletion([
        {
          role: 'system',
          content: systemMessage.content
        },
        {
          role: 'user',
          content: `请对以下合同进行分析：\n\n${fileContent}`
        }
      ]);

      if (!response.content.includes('【合同基本信息】')) {
        throw new Error('分析结果格式不符合要求，请重试');
      }

      setAnalysisResult(response.content);
    } catch (error) {
      console.error('合同分析失败:', error);
      setError(error instanceof Error ? error.message : '合同分析失败，请重试');
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
    link.download = '合同审查报告.txt';
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
          title="合同审查"
          description="AI智能分析合同条款，识别潜在风险"
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
    <div className={`min-h-screen ${theme.colors.background}`}>
      {/* 固定在顶部的欢迎区域 */}
      <div className={`${theme.colors.surface} py-4 px-6 border-b ${theme.colors.border} sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-block p-3 ${theme.colors.active} rounded-full mb-4`}>
            <DocumentMagnifyingGlassIcon className={`h-8 w-8 ${theme.colors.text.accent}`} />
          </div>
          <h2 className={`text-lg font-semibold ${theme.colors.text.primary} mb-3`}>
            合同智能审查
          </h2>
          <p className={`text-sm ${theme.colors.text.secondary} max-w-2xl mx-auto leading-relaxed`}>
            上传合同文件，AI将为您提供专业的合同审查分析、风险识别和修改建议
          </p>
        </div>
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* 文件上传区域 */}
          <div className={`${theme.colors.surface} rounded-2xl shadow-sm border ${theme.colors.border} p-6 mb-6`}>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                ${isDragging 
                  ? `${theme.colors.active} bg-opacity-50` 
                  : `${theme.colors.border} hover:border-blue-300 hover:bg-opacity-50`
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
                    <div className={`inline-block p-3 ${theme.colors.active} rounded-full mb-4`}>
                      <CloudArrowUpIcon className={`h-8 w-8 ${theme.colors.text.accent}`} />
                    </div>
                    <div className={`${theme.colors.text.primary} font-medium mb-2 text-sm`}>
                      {isDragging ? '释放文件以上传' : '拖拽文件到此处或点击上传'}
                    </div>
                    <div className={`text-xs ${theme.colors.text.secondary}`}>
                      支持 .txt、.doc、.docx 格式，最大 20MB
                    </div>
                  </>
                ) : (
                  <div className={theme.colors.text.primary}>
                    <div className={`inline-block p-3 ${theme.colors.active} rounded-full mb-4`}>
                      <DocumentTextIcon className={`h-8 w-8 ${theme.colors.text.accent}`} />
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
                  ? `${theme.colors.active} ${theme.colors.text.accent} shadow-sm hover:shadow-md`
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
          {analysisResult && (
            <>
              {/* 操作按钮组 */}
              <div className={`sticky top-0 z-20 ${theme.colors.surface} border-b ${theme.colors.border} shadow-sm`}>
                <div className="max-w-4xl mx-auto px-6 py-2 flex justify-end gap-4">
                  <button
                    onClick={() => setShowPreviewPage(true)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium
                      ${theme.colors.text.secondary} ${theme.colors.surface} border ${theme.colors.border}
                      rounded-md hover:${theme.colors.hover}
                    `}
                  >
                    <EyeIcon className="h-5 w-5" />
                    预览报告
                  </button>
                  <button
                    onClick={handleDownload}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium
                      ${theme.colors.text.accent} ${theme.colors.active}
                      border border-transparent rounded-md hover:${theme.colors.hover}
                    `}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    下载报告
                  </button>
                </div>
              </div>

              {/* 分析结果显示 */}
              <div className="max-w-4xl mx-auto p-6">
                <div className={`${theme.colors.surface} rounded-lg shadow-md p-6 mb-12`}>
                  <div className="space-y-6">
                    {showPreviewPage ? (
                      // 完整预览模式
                      <div className={`whitespace-pre-wrap ${theme.colors.text.primary}`}>
                        {analysisResult}
                      </div>
                    ) : (
                      // 折叠面板模式
                      analysisResult.split('【').map((section, index) => {
                        if (index === 0) return null;
                        // 改进分割逻辑，确保完整获取内容
                        const titleMatch = section.match(/([^】]+)】([\s\S]+)$/);
                        if (!titleMatch) return null;
                        const [_, title, content] = titleMatch;
                        
                        return (
                          <div key={index} className={`border ${theme.colors.border} rounded-lg p-4 hover:shadow-sm transition-shadow`}>
                            <details open>
                              <summary className="flex items-center mb-4 cursor-pointer">
                                <div className={`w-1 h-6 ${theme.colors.text.accent} mr-2`}></div>
                                <h3 className={`text-lg font-semibold ${theme.colors.text.primary}`}>{title}</h3>
                              </summary>
                              <div className={`text-sm ${theme.colors.text.secondary} whitespace-pre-wrap pl-6 space-y-2`}>
                                {content.trim()}
                              </div>
                            </details>
                          </div>
                        );
                      })
                    )}
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

      {/* 预览页面 */}
      {showPreviewPage && (
        <PreviewPage
          content={analysisResult}
          onBack={() => setShowPreviewPage(false)}
        />
      )}
    </div>
  );
};

export default ContractReview; 