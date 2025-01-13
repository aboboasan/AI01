import React, { useState } from 'react';
import { ChatWindow } from './components/Chat';
import { DocumentSearch } from './components/Document';
import { DocumentWriter } from './components/Writing';
import { ContractReview } from './components/Contract';
import { CaseAnalysis } from './components/CaseAnalysis';
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
  ArrowRightIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  description: string;
  features: string[];
}

const tabs: Tab[] = [
  {
    id: 'chat',
    name: 'AI法律咨询',
    icon: ChatBubbleLeftRightIcon,
    component: ChatWindow,
    description: '您的私人法律顾问，为您提供专业的法律咨询服务',
    features: [
      '专业解答法律问题',
      '分析案情提供建议',
      '解释法律术语',
      '评估法律风险',
      '推荐解决方案'
    ]
  },
  {
    id: 'analysis',
    name: '案件卷宗分析',
    icon: ScaleIcon,
    component: CaseAnalysis,
    description: '智能分析案件卷宗，提供专业的法律分析和建议',
    features: [
      '智能提取关键信息',
      '多维度案情分析',
      '法条精准引用',
      '案件要素归纳',
      '生成分析报告'
    ]
  },
  {
    id: 'writing',
    name: '文书生成',
    icon: DocumentTextIcon,
    component: DocumentWriter,
    description: '智能生成规范的法律文书，让文书撰写更加高效',
    features: [
      '多种文书模板',
      '智能内容生成',
      '格式规范检查',
      '法律依据引用',
      '一键导出文档'
    ]
  },
  {
    id: 'search',
    name: '案例检索',
    icon: MagnifyingGlassIcon,
    component: DocumentSearch,
    description: '快速检索相关案例，助您了解类似判例',
    features: [
      '多源数据检索',
      '智能相关度排序',
      '案例详情分析',
      '法条关联引用',
      '便捷原文访问'
    ]
  },
  {
    id: 'contract',
    name: '合同审查',
    icon: DocumentMagnifyingGlassIcon,
    component: ContractReview,
    description: '智能分析合同条款，识别潜在风险',
    features: [
      '条款风险识别',
      '合同完整性检查',
      '权益保护分析',
      '修改建议生成',
      '要点自动提取'
    ]
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || tabs[0].component;
  const activeTabInfo = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 头部区域 */}
        <div className="text-center mb-8 bg-[#F0F8FF] rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="inline-block p-4 bg-yellow-50 rounded-full mb-4 shadow-md">
            <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-serif tracking-wide">
            Lawbot AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            专业的法律智能助手，为您提供全方位的法律服务支持
          </p>
        </div>

        {/* 功能导航区 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-3 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-3 px-6 py-4 rounded-xl transition-all
                      transform hover:-translate-y-1 active:translate-y-0
                      ${isActive 
                        ? 'bg-[#F5E6D3] text-blue-700 shadow-md border border-blue-200 font-bold text-lg' 
                        : 'bg-[#FDF5E6] hover:bg-[#F5E6D3] text-gray-700 hover:text-blue-700 shadow hover:shadow-md border border-blue-200 font-semibold text-lg'
                      }
                    `}
                  >
                    <div className={`p-3 rounded-lg ${isActive ? 'bg-yellow-50' : 'bg-yellow-50'}`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-blue-500'}`} />
                    </div>
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 功能说明区 */}
        <div className="mb-8 bg-[#F0F8FF] rounded-2xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  {(() => {
                    const Icon = activeTabInfo.icon;
                    return <Icon className="h-7 w-7 text-blue-500" />;
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeTabInfo.name}
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
                {activeTabInfo.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeTabInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-4 rounded-lg border border-blue-200">
                    <div className="p-2 bg-yellow-50 rounded-md">
                      <ArrowRightIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 功能内容区 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
          <div className="h-[calc(100vh-24rem)]">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 