import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const MobileLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/legal-consultation', label: 'AI法律咨询', icon: '💬' },
    { path: '/case-analysis', label: '检院案件分析', icon: '⚖️' },
    { path: '/case-search', label: '案例搜索', icon: '🔍' },
    { path: '/document-draft', label: '文书生成', icon: '📝' },
    { path: '/contract-review', label: '合同审查', icon: '📋' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 折叠按钮 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        {isMenuOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* 菜单面板 */}
      <div
        className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-16 px-4">
          <div className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Lawbot AI
          </div>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div
        className={`min-h-screen transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MobileLayout; 