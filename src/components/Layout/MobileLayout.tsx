import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const MobileLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/legal-consultation', label: 'AI法律咨询', icon: '💬' },
    { path: '/case-analysis', label: '检院案件分析', icon: '⚖️' },
    { path: '/lawyer-analysis', label: '律师角度分析', icon: '👨‍⚖️' },
    { path: '/case-search', label: '案例搜索', icon: '🔍' },
    { path: '/document-draft', label: '文书生成', icon: '📝' },
    { path: '/contract-review', label: '合同审查', icon: '📋' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    if (location.pathname === '/legal-consultation') {
      setIsMenuOpen(true);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 折叠/返回按钮 */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <button
          onClick={handleBack}
          className={`p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors ${
            isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="返回"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 菜单面板 - 使用固定定位避免布局问题 */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-8 px-4">
          <div className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Lawbot AI
          </div>
          <nav className="space-y-2">
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
                <span className="text-2xl" role="img" aria-label={item.label}>{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区域 - 使用相对定位和transform避免闪烁 */}
      <main
        className={`relative min-h-screen bg-gray-50 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-full pointer-events-none' : 'translate-x-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout; 