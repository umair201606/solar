import { useEffect, useState, useRef } from 'react';

export default function useCounter(target, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);
  const prevEnabled = useRef(false);

  useEffect(() => {
    if (!enabled || prevEnabled.current) {
      return;
    }

    prevEnabled.current = true;

    let startTime = null;
    let rafId;

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [target, duration, enabled]);

  return count;
}
