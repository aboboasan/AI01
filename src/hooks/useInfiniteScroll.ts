import { useRef, useCallback } from 'react';

export const useInfiniteScroll = (callback: () => void, options = {}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          callback();
        }
      }, options);
      
      if (node) observer.current.observe(node);
    },
    [callback, options]
  );
  
  return lastElementRef;
};

export default useInfiniteScroll; 