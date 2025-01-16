import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeMode, ThemeContextType } from '../types/theme';

// 定义主题配置
const themes: Record<ThemeMode, Theme> = {
  default: {
    mode: 'default',
    colors: {
      background: 'bg-gradient-to-br from-sky-50 to-indigo-50',
      surface: 'bg-white/80',
      border: 'border-gray-200',
      active: 'bg-sky-50',
      hover: 'hover:bg-sky-50',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        accent: 'text-sky-600',
      },
      gradient: {
        from: 'from-sky-300',
        via: 'via-sky-400',
        to: 'to-sky-500',
      },
    },
  },
  light: {
    mode: 'light',
    colors: {
      background: 'bg-gradient-to-br from-blue-50 to-purple-50',
      surface: 'bg-white/90',
      border: 'border-gray-100',
      active: 'bg-blue-50',
      hover: 'hover:bg-blue-50',
      text: {
        primary: 'text-gray-800',
        secondary: 'text-gray-500',
        accent: 'text-blue-600',
      },
      gradient: {
        from: 'from-blue-300',
        via: 'via-blue-400',
        to: 'to-blue-500',
      },
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      background: 'bg-gradient-to-br from-gray-900 to-slate-900',
      surface: 'bg-gray-800/80',
      border: 'border-gray-700',
      active: 'bg-gray-700',
      hover: 'hover:bg-gray-700',
      text: {
        primary: 'text-gray-100',
        secondary: 'text-gray-400',
        accent: 'text-sky-400',
      },
      gradient: {
        from: 'from-sky-800',
        via: 'via-sky-900',
        to: 'to-slate-900',
      },
    },
  },
};

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从 localStorage 获取保存的主题，如果没有则使用默认主题
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'default';
  });

  // 当主题改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const value = {
    theme: themes[themeMode],
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义 hook 用于获取主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 