import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    isMobile: typeof windowSize?.width === 'number' && windowSize?.width < 768,
    isTablet:
      typeof windowSize?.width === 'number' &&
      windowSize?.width >= 768 &&
      windowSize?.width < 1024,
    isDesktop:
      // desktop and laptop
      typeof windowSize?.width === 'number' && windowSize?.width >= 1024,
  };
}
