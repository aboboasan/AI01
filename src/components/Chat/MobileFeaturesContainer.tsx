import React, { useState, useEffect } from 'react';
import MobileFeatureView from './MobileFeatureView';
import './MobileFeatures.css';

interface MobileFeaturesContainerProps {
  onFeatureSelect: (input: string) => void;
}

const MobileFeaturesContainer: React.FC<MobileFeaturesContainerProps> = ({
  onFeatureSelect
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: 'AI法律咨询',
      icon: '💬',
      description: '智能法律顾问为您提供专业的法律咨询服务，解答您的法律疑问。',
      onClick: () => onFeatureSelect('我需要法律咨询服务')
    },
    {
      title: '文书生成',
      icon: '📝',
      description: '快速生成标准法律文书，包括合同、协议、声明等多种类型。',
      onClick: () => onFeatureSelect('帮我生成法律文书')
    },
    {
      title: '案例检索',
      icon: '🔍',
      description: '海量法律案例库，帮您找到相似案例，提供参考依据。',
      onClick: () => onFeatureSelect('查找相关法律案例')
    },
    {
      title: '合同审查',
      icon: '📋',
      description: '专业合同审查服务，识别潜在风险，保护您的权益。',
      onClick: () => onFeatureSelect('审查合同内容')
    }
  ];

  // 监听滚动更新活动页面索引
  useEffect(() => {
    const container = document.querySelector('.mobile-features-container');
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            setActiveIndex(index);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    container.childNodes.forEach((child) => {
      observer.observe(child as Element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mobile-features-container">
      {features.map((feature, index) => (
        <MobileFeatureView key={index} {...feature} />
      ))}
      <div className="scroll-indicator">
        {features.map((_, index) => (
          <div
            key={index}
            className={`scroll-dot ${index === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileFeaturesContainer; 