import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BackgroundDecoration: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      {/* 左上角装饰 */}
      <div className={`absolute top-0 left-0 w-96 h-96 ${theme.colors.gradient.from} opacity-30 blur-3xl`} />
      
      {/* 右上角装饰 */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${theme.colors.gradient.via} opacity-30 blur-3xl`} />
      
      {/* 左下角装饰 */}
      <div className={`absolute bottom-0 left-0 w-96 h-96 ${theme.colors.gradient.via} opacity-30 blur-3xl`} />
      
      {/* 右下角装饰 */}
      <div className={`absolute bottom-0 right-0 w-96 h-96 ${theme.colors.gradient.to} opacity-30 blur-3xl`} />
      
      {/* 中心装饰 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors.gradient.from} ${theme.colors.gradient.via} ${theme.colors.gradient.to} opacity-50`} />
    </>
  );
};

export default BackgroundDecoration; 