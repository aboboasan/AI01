import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BackgroundDecoration from '../common/BackgroundDecoration';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 relative">
      <BackgroundDecoration />
      
      <div className="relative z-10">
        <div className="h-screen w-72 bg-white/90 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.15)] 
          border-r border-gray-300">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-sky-700 mb-8 tracking-wider flex items-center">
              <span className="text-sky-900">Lawbot</span>
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
            <div className="bg-white/85 backdrop-blur-md rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)] 
              border border-gray-300 min-h-[calc(100vh-4rem)]">
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