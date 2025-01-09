import React, { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';

interface SearchResult {
  id: string;
  title: string;
  court: string;
  date: string;
  summary: string;
}

const CaseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    court: '',
    dateRange: '',
    caseType: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: 实现实际的搜索逻辑
    setTimeout(() => {
      setResults([
        {
          id: '1',
          title: '张三诉李四合同纠纷案',
          court: '北京市第一中级人民法院',
          date: '2023-12-01',
          summary: '本案涉及合同履行过程中的违约责任认定问题...'
        },
        // 更多模拟数据
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="输入关键词搜索案例..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}
            >
              筛选
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <select
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
              value={filters.court}
              onChange={(e) => setFilters({ ...filters, court: e.target.value })}
            >
              <option value="">所有法院</option>
              <option value="supreme">最高人民法院</option>
              <option value="high">高级人民法院</option>
              <option value="intermediate">中级人民法院</option>
            </select>
            
            <select
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="">所有时间</option>
              <option value="1year">最近一年</option>
              <option value="3years">最近三年</option>
              <option value="5years">最近五年</option>
            </select>
            
            <select
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
              value={filters.caseType}
              onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
            >
              <option value="">所有类型</option>
              <option value="civil">民事案件</option>
              <option value="criminal">刑事案件</option>
              <option value="administrative">行政案件</option>
            </select>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-gray-700 rounded-lg p-4 mb-4 hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{result.title}</h3>
            <div className="flex items-center text-sm text-gray-300 mb-2">
              <span>{result.court}</span>
              <span className="mx-2">•</span>
              <span>{result.date}</span>
            </div>
            <p className="text-gray-400 text-sm">{result.summary}</p>
          </div>
        ))}
        
        {results.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 mt-8">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>输入关键词开始搜索案例</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseSearch; 