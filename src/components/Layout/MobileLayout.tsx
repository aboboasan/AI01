import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaComments, FaSearch, FaFileAlt, FaFileContract, FaGavel } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { MdAutoAwesome } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types/theme';
import { IconType } from 'react-icons';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { path: '/legal-consultation', label: 'AI法律咨询', icon: '💬' },
  { path: '/lawyer-analysis', label: '律师角度分析', icon: '👨‍⚖️' },
  { path: '/case-search', label: '案例搜索', icon: '🔍' },
  { path: '/document-draft', label: '文书生成', icon: '📝' },
  { path: '/contract-review', label: '合同审查', icon: '📋' },
];

interface ThemeOption {
  value: ThemeMode;
  icon: IconType;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'default', icon: MdAutoAwesome, label: '默认主题' },
  { value: 'light', icon: BsSunFill, label: '明亮主题' },
  { value: 'dark', icon: BsMoonFill, label: '暗黑主题' },
];

const MobileLayout: React.FC = () => {
  const location = useLocation();
  const { theme, setThemeMode } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // 获取当前页面标题
  const currentMenuItem = menuItems.find(item => item.path === location.pathname);
  const pageTitle = currentMenuItem?.label || 'Lawbot AI';

  return (
    <div className={`min-h-screen flex flex-col ${theme.colors.background}`}>
      {/* 顶部导航栏 */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme.colors.surface} backdrop-blur-lg 
        border-b ${theme.colors.border} shadow-sm`}>
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${theme.colors.text.accent}`}>
            {pageTitle}
          </h1>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`p-2 rounded-lg ${theme.colors.hover}`}
          >
            <span className="text-lg">🎨</span>
          </button>
        </div>

        {/* 主题选择菜单 */}
        {showThemeMenu && (
          <div className={`absolute top-full left-0 right-0 ${theme.colors.surface} 
            border-b ${theme.colors.border} shadow-lg`}>
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setThemeMode(value);
                  setShowThemeMenu(false);
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-base font-medium
                  ${theme.mode === value 
                    ? `${theme.colors.active} ${theme.colors.text.accent}` 
                    : `${theme.colors.text.secondary}`}
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 mt-14 mb-16 p-4">
        <div className={`rounded-2xl ${theme.colors.surface} backdrop-blur-md 
          shadow-lg border ${theme.colors.border} p-4 min-h-[calc(100vh-8rem)]`}>
          {/* 页面内容将在这里渲染 */}
        </div>
      </main>

      {/* 底部导航栏 */}
      <nav className={`fixed bottom-0 left-0 right-0 ${theme.colors.surface} backdrop-blur-lg 
        border-t ${theme.colors.border} shadow-lg`}>
        <div className="flex justify-around">
          {menuItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex-1 py-3 flex flex-col items-center justify-center
                ${location.pathname === path 
                  ? `${theme.colors.active} ${theme.colors.text.accent}` 
                  : theme.colors.text.secondary}`}
            >
              <span className="text-xl mb-1">{icon}</span>
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout; 