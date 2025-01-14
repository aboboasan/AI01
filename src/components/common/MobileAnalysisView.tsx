import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import MobileHeader from './MobileHeader';

interface MobileAnalysisViewProps {
  title: string;
  description: string;
  content: string;
  onBack: () => void;
}

interface Section {
  title: string;
  content: string;
}

const MobileAnalysisView: React.FC<MobileAnalysisViewProps> = ({
  title,
  description,
  content,
  onBack,
}) => {
  // 将内容按照【】分段，并确保返回的是 Section[] 类型
  const sections: Section[] = content
    .split('【')
    .filter(Boolean)
    .map(section => {
      const titleMatch = section.match(/([^】]+)】([\s\S]+)$/);
      if (!titleMatch) return null;
      const [_, sectionTitle, sectionContent] = titleMatch;
      return {
        title: sectionTitle,
        content: sectionContent.trim()
      };
    })
    .filter((section): section is Section => section !== null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 固定在顶部的头部 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <MobileHeader
          title={title}
          subtitle={description}
          onBack={onBack}
        />
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Disclosure key={index} as="div" className="bg-white rounded-lg shadow-sm">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left">
                    <div className="flex items-center">
                      <div className={`w-1 h-6 rounded-full mr-3 transition-colors ${open ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <span className="text-base font-medium text-gray-900">
                        {section.title}
                      </span>
                    </div>
                    <ChevronUpIcon
                      className={`${
                        open ? 'transform rotate-180' : ''
                      } w-5 h-5 text-gray-500 transition-transform duration-200`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-4">
                    <div className="pl-4 border-l-2 border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileAnalysisView; 