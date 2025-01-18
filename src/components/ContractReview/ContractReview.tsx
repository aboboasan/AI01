import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon, ArrowPathIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Message } from '../Chat/types';
import { chatCompletion } from '../../services/api';
import mammoth from 'mammoth';
import PreviewPage from './PreviewPage';
import MobileAnalysisView from '../common/MobileAnalysisView';
import MobileActionButtons from '../common/MobileActionButtons';
import { FileInfo } from '../../types/file';

interface ContractReviewProps {
  // 如果需要props，在这里定义
}

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
- 重点提示：[列出核心注意事项]

请严格按照上述格式进行分析和输出，确保分析的专业性和建议的可操作性。对于每个部分：
1. 基于合同文本进行客观分析
2. 给出明确的问题指出
3. 提供具体可行的建议
4. 注意分析的逻辑性和完整性

请分析上传的合同文件，按照此格式输出审查报告。`,
  timestamp: new Date().toISOString()
};

const ContractReview: React.FC<ContractReviewProps> = () => {
  const [file, setFile] = useState<FileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile({
        file: selectedFile,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadTime: new Date().toLocaleString()
      });
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

  const analyzeContract = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const text = await extractTextFromFile(file.file);
      const messages: Message[] = [
        systemMessage,
        {
          id: 'user',
          role: 'user',
          content: text,
          timestamp: new Date().toISOString()
        }
      ];

      const response = await chatCompletion(messages);
      setAnalysisResult(response.content);
    } catch (error) {
      console.error('合同分析失败:', error);
      setAnalysisResult('合同分析失败，请重试。');
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
    link.download = `合同分析报告_${new Date().toLocaleDateString()}.txt`;
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

  const mobileActions = [
    {
      icon: <CloudArrowUpIcon className="w-6 h-6" />,
      label: '上传合同',
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: <DocumentMagnifyingGlassIcon className="w-6 h-6" />,
      label: '开始分析',
      onClick: analyzeContract,
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
          fileInputRef={fileInputRef}
        />
        <MobileActionButtons actions={mobileActions} />
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
                <DocumentTextIcon className="w-16 h-16 text-gray-400" />
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
                <DocumentTextIcon className="w-12 h-12 text-blue-500" />
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
              onChange={handleFileChange}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={analyzeContract}
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
                    <span>正在分析合同，请稍候...</span>
                  </div>
                ) : (
                  <span>上传合同文件开始分析</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractReview; 