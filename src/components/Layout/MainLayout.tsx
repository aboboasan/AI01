import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BackgroundDecoration from '../common/BackgroundDecoration';
import { useTheme } from '../../context/ThemeContext';

const MainLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen relative ${theme.colors.background}`}>
      <BackgroundDecoration />
      
      <div className="relative z-10">
        <div className={`h-screen w-72 ${theme.colors.surface} backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] 
          border-r ${theme.colors.border}`}>
          <div className="p-6">
            <h1 className={`text-3xl font-bold ${theme.colors.text.accent} mb-8 tracking-wider flex items-center`}>
              <span className={theme.colors.text.primary}>Lawbot</span>
              <span className="ml-2 bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">AI</span>
            </h1>
            <Sidebar />
          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-auto relative z-10">
        <div className="h-full max-w-7xl mx-auto p-8">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className={`${theme.colors.surface} backdrop-blur-md rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)] 
              border ${theme.colors.border} min-h-[calc(100vh-4rem)]`}>
              <Outlet />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 