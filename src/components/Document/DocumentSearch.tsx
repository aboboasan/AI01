import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, MapPinIcon, ScaleIcon, DocumentTextIcon, LinkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { searchLegalCases, getRandomLegalInfo, type LegalCase } from '../../services/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';

export const DocumentSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [randomInfo, setRandomInfo] = useState<LegalCase[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // 获取随机法律信息
    const info = getRandomLegalInfo(5);
    setRandomInfo(info);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('请输入搜索内容');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const searchResponse = await searchLegalCases(query);
      // 解析API返回的搜索结果文本，转换为案例格式
      const parsedResults = parseSearchResults(searchResponse);
      setSearchResults(parsedResults);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || '搜索失败，请重试');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 解析搜索结果文本为案例格式
  const parseSearchResults = (searchResponse: string): LegalCase[] => {
    try {
      // 尝试直接解析JSON格式的响应
      return JSON.parse(searchResponse);
    } catch {
      // 如果不是JSON格式，则解析文本格式的响应
      const cases: LegalCase[] = [];
      const sections = searchResponse.split(/案例\s*\d+:/g).filter(Boolean);
      
      sections.forEach((section, index) => {
        const lines = section.trim().split('\n');
        const caseInfo: Partial<LegalCase> = {
          id: (index + 1).toString(),
          title: lines[0]?.trim() || '未知案件',
          reference: '',
          court: '',
          date: '',
          location: '',
          caseType: '',
          summary: '',
          url: `https://wenshu.court.gov.cn/case/${index + 1}`
        };

        lines.forEach(line => {
          if (line.includes('法院：')) caseInfo.court = line.split('：')[1]?.trim();
          else if (line.includes('日期：')) caseInfo.date = line.split('：')[1]?.trim();
          else if (line.includes('地点：')) caseInfo.location = line.split('：')[1]?.trim();
          else if (line.includes('案号：')) caseInfo.reference = line.split('：')[1]?.trim();
          else if (line.includes('类型：')) caseInfo.caseType = line.split('：')[1]?.trim();
          else if (line.includes('摘要：')) caseInfo.summary = line.split('：')[1]?.trim();
        });

        if (!caseInfo.summary) {
          caseInfo.summary = lines.slice(1).join(' ').trim();
        }

        cases.push(caseInfo as LegalCase);
      });

      return cases;
    }
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const CaseCard = ({ info }: { info: LegalCase }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{info.title}</h3>
        <span className="text-sm font-medium text-gray-500">{info.reference}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <ScaleIcon className="h-5 w-5 mr-2" />
          <span>{info.court}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>{info.date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span>{info.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          <span>{info.caseType}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{info.summary}</p>
      
      <div className="flex justify-end">
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <LinkIcon className="h-5 w-5 mr-1" />
          查看完整判决书
        </a>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">法律检索</h2>
        <div className="flex gap-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入要检索的法律问题或关键词"
            className="flex-1"
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2"
          >
            {loading ? <Loading size="sm" /> : '搜索'}
          </Button>
        </div>
        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* 搜索结果 */}
        {searchResults.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">搜索结果</h3>
            <div className="space-y-4">
              {currentResults.map((result) => (
                <CaseCard key={result.id} info={result} />
              ))}
            </div>
            
            {/* 分页控制 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6 sticky bottom-0 bg-white py-4 border-t">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeftIcon className="h-5 w-5" />}
                >
                  上一页
                </Button>
                <span className="text-gray-600">
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  icon={<ChevronRightIcon className="h-5 w-5" />}
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* 随机法律信息展示 */
          !loading && (
            <>
              <h3 className="text-xl font-semibold mb-4">推荐案例</h3>
              <div className="space-y-4">
                {randomInfo.map((info) => (
                  <CaseCard key={info.id} info={info} />
                ))}
              </div>
            </>
          )
        )}

        {randomInfo.length === 0 && !loading && searchResults.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>输入关键词开始搜索案例</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSearch; 