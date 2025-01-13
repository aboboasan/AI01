import React, { useState } from 'react';
import { MagnifyingGlassIcon, LinkIcon, DocumentTextIcon, ScaleIcon, CalendarIcon, BookmarkIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { chatCompletion, ChatMessage } from '../../services/api';

interface SearchResult {
  title: string;
  content: string;
  source: string;
  date: string;
  url: string;
  relevance: number;
  court: string;
  caseNumber: string;
  caseType: string;
  judgmentResult: string;
  legalBasis: string[];
  keyPoints: string[];
}

const DocumentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    setError('');
    
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `作为您的法律检索助手，我将帮您找到最有价值的法律参考资料。请基于以下来源搜索相关案例，并提供尽可能详细的信息：

1. 中国裁判文书网 (https://wenshu.court.gov.cn)
2. 北大法宝 (https://www.pkulaw.com)
3. 无讼案例 (https://www.itslaw.com)
4. 法信 (http://www.faxin.cn)
5. 威科先行 (https://law.wkinfo.com.cn)

对于搜索结果，请：
1. 返回5个最相关的真实案例
2. 确保案例真实且具有参考价值
3. 优先选择新近判决的案例
4. 重点关注对咨询者有利的判例
5. 提供完整的案例信息和多个来源链接

请按以下格式返回每个案例：
[标题]案件名称（需包含案由）
[案号]完整案号
[法院]审理法院
[日期]判决日期
[类型]案件类型
[来源]来源网站及链接（可提供多个来源）
[判决]判决结果要点
[依据]适用的法律依据
[要点]裁判要点（3-5条）
[内容]
- 案件基本情况
- 争议焦点
- 裁判理由
- 判决结果
[相关度]与搜索关键词的相关度(0-100)

请确保信息完整准确，便于用户深入研究案例。`
        },
        {
          role: 'user',
          content: searchTerm
        }
      ];

      const response = await chatCompletion(messages);
      
      // 解析返回结果
      const results: SearchResult[] = [];
      const { content } = response;
      const sections = content.split('\n\n');
      
      for (const section of sections) {
        if (!section.trim()) continue;
        
        const title = section.match(/\[标题\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const caseNumber = section.match(/\[案号\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const court = section.match(/\[法院\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const date = section.match(/\[日期\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const caseType = section.match(/\[类型\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const source = section.match(/\[来源\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const judgmentResult = section.match(/\[判决\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const legalBasis = section.match(/\[依据\](.*?)(?=\[|$)/s)?.[1]?.split('\n').map((s: string) => s.trim()).filter(Boolean);
        const keyPoints = section.match(/\[要点\](.*?)(?=\[|$)/s)?.[1]?.split('\n').map((s: string) => s.trim()).filter(Boolean);
        const content = section.match(/\[内容\](.*?)(?=\[|$)/s)?.[1]?.trim();
        const relevance = parseInt(section.match(/\[相关度\](\d+)/)?.[1] || '0');
        
        // 提取所有URL
        const urls = source?.match(/https?:\/\/[^\s)]+/g) || [];
        const mainUrl = urls[0] || '';
        
        if (title && content && source) {
          results.push({ 
            title, 
            content, 
            source: source.replace(new RegExp(urls.join('|'), 'g'), '').trim(), 
            date: date || '未知',
            url: mainUrl,
            relevance,
            court: court || '未知',
            caseNumber: caseNumber || '未知',
            caseType: caseType || '未知',
            judgmentResult: judgmentResult || '',
            legalBasis: legalBasis || [],
            keyPoints: keyPoints || []
          });
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
      setError('搜索过程中出现错误，请重试');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* 温馨的欢迎区域 */}
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
              <ScaleIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              智能法律检索
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              让我们一起探索法律的智慧，为您找到最有价值的案例参考
            </p>
          </div>

          {/* 搜索表单 */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                  <span className="text-gray-700 font-medium">输入您的法律问题，我们帮您找到相关案例</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="例如：房屋买卖合同纠纷、知识产权侵权、劳动争议..."
                    className="flex-1 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`px-8 py-3 rounded-xl flex items-center gap-2 transition-all ${
                      isSearching
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow'
                    }`}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <span className="font-medium">{isSearching ? '搜索中...' : '开始搜索'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* 搜索结果 */}
          <div className="space-y-8">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
              >
                {/* 案件标题和相关度 */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                      {result.title}
                    </h3>
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                      相关度: {result.relevance}%
                    </span>
                  </div>
                </div>

                {/* 案件基本信息 */}
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{result.caseNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScaleIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{result.court}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{result.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookmarkIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{result.caseType}</span>
                    </div>
                  </div>
                </div>

                {/* 判决结果 */}
                {result.judgmentResult && (
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      判决结果
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{result.judgmentResult}</p>
                  </div>
                )}

                {/* 法律依据 */}
                {result.legalBasis.length > 0 && (
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      法律依据
                    </h4>
                    <ul className="space-y-2">
                      {result.legalBasis.map((basis, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span className="flex-1 leading-relaxed">{basis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 裁判要点 */}
                {result.keyPoints.length > 0 && (
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-yellow-50 to-white">
                    <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                      裁判要点
                    </h4>
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                          <span className="flex-1 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 案件内容 */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gray-500 rounded-full"></span>
                    案件详情
                  </h4>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.content}</p>
                  </div>
                </div>

                {/* 来源信息和链接 */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                  <span className="text-gray-600">
                    来源：{result.source}
                  </span>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium gap-1.5"
                    >
                      <LinkIcon className="h-4 w-4" />
                      查看原文
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 初始状态提示 */}
          {!searchResults.length && !isSearching && !error && (
            <div className="text-center py-12">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <LightBulbIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                开始您的法律检索之旅
              </h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                输入关键词，我们将为您找到最相关的法律案例。您可以搜索具体的案由、法律问题或者相关描述。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSearch; 