import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { MdAutoAwesome } from 'react-icons/md';
import { FaCog } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types/theme';

const MobileLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setThemeMode } = useTheme();

  const menuItems = [
    { path: '/legal-consultation', label: 'AI法律咨询', icon: '💬' },
    { path: '/lawyer-analysis', label: '律师角度分析', icon: '👨‍⚖️' },
    { path: '/case-search', label: '案例搜索', icon: '🔍' },
    { path: '/document-draft', label: '文书生成', icon: '📝' },
    { path: '/contract-review', label: '合同审查', icon: '📋' },
  ];

  const themeOptions = [
    { value: 'default' as ThemeMode, icon: <MdAutoAwesome className="w-6 h-6" />, label: '默认主题' },
    { value: 'light' as ThemeMode, icon: <BsSunFill className="w-6 h-6" />, label: '明亮主题' },
    { value: 'dark' as ThemeMode, icon: <BsMoonFill className="w-6 h-6" />, label: '暗黑主题' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setShowThemeMenu(false);
  };

  const handleBack = () => {
    if (location.pathname === '/legal-consultation') {
      setIsMenuOpen(true);
    } else {
      navigate(-1);
    }
    setShowThemeMenu(false);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemeMenu(false);
  };

  return (
    <div className={`relative min-h-screen ${theme.colors.background}`}>
      {/* 折叠/返回按钮 */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <button
          onClick={handleBack}
          className={`p-3 rounded-full ${theme.colors.primary} text-white shadow-lg hover:${theme.colors.secondary} active:${theme.colors.active} transition-colors ${
            isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="返回"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setShowThemeMenu(false);
          }}
          className={`p-3 rounded-full ${theme.colors.primary} text-white shadow-lg hover:${theme.colors.secondary} active:${theme.colors.active} transition-colors`}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 设置按钮 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className={`p-3 rounded-full ${theme.colors.primary} text-white shadow-lg hover:${theme.colors.secondary} active:${theme.colors.active} transition-colors`}
          aria-label="设置"
        >
          <FaCog className="w-6 h-6" />
        </button>
      </div>

      {/* 主题选择菜单 */}
      {showThemeMenu && (
        <div className={`fixed right-4 top-1/2 mt-12 z-50 ${theme.colors.surface} rounded-xl shadow-lg border ${theme.colors.border} overflow-hidden`}>
          {themeOptions.map(({ value, icon, label }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`flex items-center w-full px-4 py-3 ${
                theme.mode === value
                  ? `${theme.colors.active} ${theme.colors.text.accent}`
                  : `${theme.colors.text.secondary} hover:${theme.colors.hover}`
              }`}
            >
              {icon}
              <span className="ml-3 text-base font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 菜单面板 */}
      <div
        className={`fixed inset-0 ${theme.colors.surface} z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-8 px-4">
          <div className={`text-2xl font-bold ${theme.colors.text.primary} mb-8 text-center`}>
            Lawbot AI
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                  location.pathname === item.path
                    ? `${theme.colors.active} ${theme.colors.text.accent}`
                    : `hover:${theme.colors.hover} ${theme.colors.text.secondary}`
                }`}
              >
                <span className="text-2xl" role="img" aria-label={item.label}>{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区域 */}
      <main
        className={`relative min-h-screen transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-full pointer-events-none' : 'translate-x-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout; 