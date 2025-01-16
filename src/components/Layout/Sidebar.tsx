import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaComments, FaSearch, FaFileAlt, FaFileContract, FaCog, FaGavel } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { MdAutoAwesome } from 'react-icons/md';
import { IconType } from 'react-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../types/theme';

interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/legal-consultation', icon: FaComments, label: 'AI法律咨询' },
  { path: '/lawyer-analysis', icon: FaGavel, label: '律师角度分析' },
  { path: '/case-search', icon: FaSearch, label: '案例搜索' },
  { path: '/document-draft', icon: FaFileAlt, label: '文书生成' },
  { path: '/contract-review', icon: FaFileContract, label: '合同审查' },
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

const Sidebar: React.FC = () => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { theme, setThemeMode } = useTheme();

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
              ? `${theme.colors.active} ${theme.colors.text.accent} shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]` 
              : `${theme.colors.text.secondary} ${theme.colors.hover}`}
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
          className={`
            flex items-center w-full px-4 py-3 rounded-xl text-base font-medium
            ${theme.colors.text.secondary} ${theme.colors.hover} transition-all duration-200
            before:absolute before:inset-0 before:rounded-xl before:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
            hover:before:shadow-[0_4px_8px_rgba(0,0,0,0.1)]
          `}
        >
          <FaCog className="w-5 h-5 mr-3 flex-shrink-0" />
          设置
        </button>

        {/* 主题选择菜单 */}
        {showThemeMenu && (
          <div className={`
            absolute bottom-full left-4 right-4 mb-2 ${theme.colors.surface} rounded-xl 
            shadow-[0_4px_12px_rgba(0,0,0,0.1)] border ${theme.colors.border} overflow-hidden
          `}>
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setThemeMode(value);
                  setShowThemeMenu(false);
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-base font-medium
                  transition-colors duration-200
                  ${theme.mode === value 
                    ? `${theme.colors.active} ${theme.colors.text.accent}` 
                    : `${theme.colors.text.secondary} ${theme.colors.hover}`}
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