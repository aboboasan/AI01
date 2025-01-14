import React, { useState, useEffect, useRef } from 'react';
import './VirtualList.css';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemSize: (item: T) => number;
  height: number;
  className?: string;
}

function VirtualList<T>({
  items,
  renderItem,
  itemSize,
  height,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastItemsLength = useRef(items.length);

  // 自动滚动到底部
  useEffect(() => {
    const container = containerRef.current;
    if (container && items.length > lastItemsLength.current) {
      const scrollToBottom = () => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      };
      scrollToBottom();
    }
    lastItemsLength.current = items.length;
  }, [items.length]);

  // 防止滚动条自动反弹
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isUserScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const getItemOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemSize(items[i]);
    }
    return offset;
  };

  const getVisibleRange = () => {
    const start = Math.floor(scrollTop / 50);
    const visibleCount = Math.ceil(height / 50) + 1;
    const end = Math.min(start + visibleCount, items.length);
    return { start, end };
  };

  const { start, end } = getVisibleRange();
  const visibleItems = items.slice(start, end);
  const totalHeight = items.reduce((sum, item) => sum + itemSize(item), 0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={start + index}
            style={{
              position: 'absolute',
              top: getItemOffset(start + index),
              width: '100%',
            }}
            className="animate-message-in"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList; 