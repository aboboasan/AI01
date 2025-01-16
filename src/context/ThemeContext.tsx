import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig } from '../types/theme';
import { defaultTheme, lightTheme, darkTheme } from '../config/themes';

interface ThemeContextType {
  theme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
      setThemeMode(savedTheme as ThemeMode);
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    let newTheme: ThemeConfig;
    switch (mode) {
      case 'light':
        newTheme = lightTheme;
        break;
      case 'dark':
        newTheme = darkTheme;
        break;
      default:
        newTheme = defaultTheme;
    }
    setTheme(newTheme);
    localStorage.setItem('theme-mode', mode);

    // 更新 body 的类名以支持全局样式
    document.body.className = mode === 'dark' ? 'dark' : '';
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 