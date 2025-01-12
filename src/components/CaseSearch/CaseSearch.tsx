import React, { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CalendarIcon, MapPinIcon, ScaleIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { searchLegalCases, getRandomLegalInfo, type LegalCase } from '../../services/api';

interface Filters {
  court: string;
  dateRange: string;
  caseType: string;
}

const CaseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LegalCase[]>([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({
    court: '',
    dateRange: '',
    caseType: ''
  });

  const handleRandomSearch = async () => {
    setIsSearching(true);
    setError('');
    try {
      const randomCases = await getRandomLegalInfo();
      setResults(randomCases);
    } catch (error) {
      console.error('搜索失败:', error);
      setError('获取案例失败，请重试');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    setError('');
    try {
      const searchResults = await searchLegalCases(searchTerm);
      // 应用筛选条件
      const filteredResults = searchResults.filter(result => {
        const courtMatch = !filters.court || result.court.includes(filters.court);
        const typeMatch = !filters.caseType || result.caseType === filters.caseType;
        
        if (!filters.dateRange) return courtMatch && typeMatch;
        
        const caseDate = new Date(result.date);
        const now = new Date();
        const yearDiff = now.getFullYear() - caseDate.getFullYear();
        
        switch (filters.dateRange) {
          case '1year':
            return yearDiff <= 1 && courtMatch && typeMatch;
          case '3years':
            return yearDiff <= 3 && courtMatch && typeMatch;
          case '5years':
            return yearDiff <= 5 && courtMatch && typeMatch;
          default:
            return courtMatch && typeMatch;
        }
      });
      
      setResults(filteredResults);
    } catch (error) {
      console.error('搜索失败:', error);
      setError('搜索失败，请重试');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="请输入要检索的法律问题或关键词"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                multiline
                className="flex-1"
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <Button
              type="submit"
              isLoading={isSearching}
              icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}
            >
              筛选
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <select
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.court}
              onChange={(e) => setFilters({ ...filters, court: e.target.value })}
            >
              <option value="">所有法院</option>
              <option value="最高人民法院">最高人民法院</option>
              <option value="高级人民法院">高级人民法院</option>
              <option value="中级人民法院">中级人民法院</option>
            </select>
            
            <select
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="">所有时间</option>
              <option value="1year">最近一年</option>
              <option value="3years">最近三年</option>
              <option value="5years">最近五年</option>
            </select>
            
            <select
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.caseType}
              onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
            >
              <option value="">所有类型</option>
              <option value="民事案件">民事案件</option>
              <option value="刑事案件">刑事案件</option>
              <option value="行政案件">行政案件</option>
            </select>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{result.title}</h3>
              <span className="text-sm font-medium text-gray-500">{result.reference}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <ScaleIcon className="h-5 w-5 mr-2" />
                <span>{result.court}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{result.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{result.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                <span>{result.caseType}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{result.summary}</p>
            
            <div className="flex justify-end">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <LinkIcon className="h-5 w-5 mr-1" />
                查看完整判决书
              </a>
            </div>
          </div>
        ))}
        
        {results.length === 0 && !isSearching && (
          <div className="text-center text-gray-500 mt-8">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>输入关键词开始搜索案例</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseSearch; 