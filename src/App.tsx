import React, { useState } from 'react';
import ChatWindow from './components/Chat/ChatWindow';
import DocumentSearch from './components/Document/DocumentSearch';
import DocumentWriter from './components/Writing/DocumentWriter';
import ContractReview from './components/Contract/ContractReview';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

type Tab = 'chat' | 'search' | 'document' | 'writing';

interface ChatSession {
  id: string;
  messages: any[];
  timestamp: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      timestamp: new Date().toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newSession.id);
    setActiveTab('chat');
  };

  const handleClearChats = () => {
    setChatSessions([]);
    setActiveChatId(null);
  };

  const tabs = [
    { id: 'chat', name: '法律咨询', icon: ChatBubbleLeftRightIcon, component: ChatWindow },
    { id: 'search', name: '文书生成', icon: DocumentTextIcon, component: DocumentWriter },
    { id: 'document', name: '法律检索', icon: MagnifyingGlassIcon, component: DocumentSearch },
    { id: 'writing', name: '合同审查', icon: PencilSquareIcon, component: ContractReview },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ChatWindow;

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧边栏 */}
      {showSidebar && (
        <div className="w-64 bg-gray-900 flex flex-col">
          {/* 新建聊天按钮 */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-between px-3 py-2 text-white border border-gray-700 rounded-md hover:bg-gray-700/50"
            >
              <div className="flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>新建对话</span>
              </div>
            </button>
          </div>

          {/* 功能列表 */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === tab.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* 聊天历史记录 */}
            {chatSessions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 px-3 mb-2">历史对话</div>
                <div className="space-y-1">
                  {chatSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        setActiveChatId(session.id);
                        setActiveTab('chat');
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                        activeChatId === session.id
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      <div className="flex-1 truncate text-left">
                        新对话 {new Date(session.timestamp).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部删除按钮 */}
          {chatSessions.length > 0 && (
            <div className="p-3 border-t border-gray-800">
              <button
                onClick={handleClearChats}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                清除所有对话
              </button>
            </div>
          )}
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center text-sm font-medium text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.name}
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <UserCircleIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* 主要内容 */}
        <div className="flex-1 overflow-hidden">
          <ActiveComponent chatId={activeChatId} />
        </div>
      </div>
    </div>
  );
}

export default App; 