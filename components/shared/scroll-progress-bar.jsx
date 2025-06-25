'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollProgressBar() {
  const [scroll, setScroll] = useState(0);
  const targetScroll = useRef(0);
  const animationFrame = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      targetScroll.current = scrolled;
      animateScroll();
    };

    const animateScroll = () => {
      setScroll(prev => {
        const diff = targetScroll.current - prev;
        if (Math.abs(diff) < 0.5) return targetScroll.current;
        const next = prev + diff * 0.15; // Adjust 0.15 for speed
        animationFrame.current = requestAnimationFrame(animateScroll);
        return next;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div className="w-full h-1 bg-transparent">
      <div
        className="h-1 transition-none bg-gradient-to-r from-yellow-800 to-yellow-400"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
}