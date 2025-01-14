import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaComments, FaBalanceScale, FaSearch, FaFileAlt, FaFileContract, FaCog } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { MdAutoAwesome } from 'react-icons/md';
import { IconType } from 'react-icons';

interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/legal-consultation', icon: FaComments, label: 'AI法律咨询' },
  { path: '/case-analysis', icon: FaBalanceScale, label: '检院案件分析' },
  { path: '/case-search', icon: FaSearch, label: '案例搜索' },
  { path: '/document-draft', icon: FaFileAlt, label: '文书生成' },
  { path: '/contract-review', icon: FaFileContract, label: '合同审查' },
];

type Theme = 'auto' | 'light' | 'dark';

interface ThemeOption {
  value: Theme;
  icon: IconType;
  label: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'auto', icon: MdAutoAwesome, label: '自动' },
  { value: 'light', icon: BsSunFill, label: '浅色' },
  { value: 'dark', icon: BsMoonFill, label: '深色' },
];

const Sidebar: React.FC = () => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('auto');

  return (
    <nav className="space-y-2">
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex items-center px-4 py-3 rounded-xl text-base font-medium
            transition-all duration-200 relative
            ${isActive 
              ? 'bg-sky-100 text-sky-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]' 
              : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'}
            before:absolute before:inset-0 before:rounded-xl before:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
            hover:before:shadow-[0_4px_8px_rgba(0,0,0,0.1)]
          `}
        >
          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
          {label}
        </NavLink>
      ))}

      {/* 设置按钮 */}
      <div className="relative mt-auto pt-4">
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium
            text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200
            before:absolute before:inset-0 before:rounded-xl before:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
            hover:before:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
        >
          <FaCog className="w-5 h-5 mr-3 flex-shrink-0" />
          设置
        </button>

        {/* 主题选择菜单 */}
        {showThemeMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl 
            shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setCurrentTheme(value);
                  setShowThemeMenu(false);
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-base font-medium
                  transition-colors duration-200
                  ${currentTheme === value 
                    ? 'bg-sky-50 text-sky-700' 
                    : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'}
                `}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar; 