import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { searchLegalCases } from '../../services/api';
import type { LegalCase } from '../../services/types';

export const CaseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalCase[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('请输入搜索关键词');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchLegalCases(searchTerm);
      setSearchResults(results);
      if (results.length === 0) {
        setError('未找到相关案例');
      }
    } catch (err) {
      setError('搜索失败，请重试');
      console.error('搜索出错:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-200 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="输入关键词搜索相关案例..."
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              absolute right-2 top-1/2 transform -translate-y-1/2
              px-4 py-2 rounded-lg flex items-center gap-2
              bg-gradient-to-r from-blue-500 to-blue-600 text-white
              transition-all duration-200
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-0.5'}
            `}
          >
            <FunnelIcon className="w-5 h-5" />
            搜索
          </button>
        </form>

        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{result.title}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                  <span>{result.court}</span>
                  <span>{result.date}</span>
                  <span>{result.type}</span>
                </div>
                <p className="text-gray-700 mb-2">{result.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{result.reference}</span>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    查看详情 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 