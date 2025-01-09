import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DocumentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    // TODO: 实现搜索功能
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              法律文献检索
            </h2>
            <p className="text-gray-500">
              快速检索法律条文、案例和专业文献
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="输入关键词、法条或案例编号..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={!searchTerm.trim() || isSearching}
                className={`
                  px-6 py-3 rounded-lg flex items-center justify-center
                  ${searchTerm.trim() && !isSearching
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                搜索
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">搜索提示</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 输入具体的法条编号可直接查询相关条文</li>
                <li>• 使用关键词组合可以获得更精准的搜索结果</li>
                <li>• 支持按案例类型、审理法院等条件筛选</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSearch; 