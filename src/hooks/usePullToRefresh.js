import { useState, useEffect, useRef, useCallback } from 'react';

const THRESHOLD = 80;
const MAX_PULL = 120;

export function usePullToRefresh(onRefresh) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const active = useRef(false);

  const canPull = useCallback(() => {
    return window.scrollY <= 0;
  }, []);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (!canPull()) return;
      startY.current = e.touches[0].clientY;
      active.current = true;
    };

    const onTouchMove = (e) => {
      if (!active.current || refreshing) return;
      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0 && canPull()) {
        const distance = Math.min(diff * 0.5, MAX_PULL);
        setPullDistance(distance);
        setPulling(true);
        if (distance > 10) {
          e.preventDefault();
        }
      } else {
        setPulling(false);
        setPullDistance(0);
      }
    };

    const onTouchEnd = async () => {
      if (!active.current) return;
      active.current = false;

      if (pullDistance >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPullDistance(THRESHOLD * 0.5);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      }

      setPulling(false);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [canPull, onRefresh, pullDistance, refreshing]);

  return { pulling: pulling || refreshing, pullDistance, refreshing };
}
