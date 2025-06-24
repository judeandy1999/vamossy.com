'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScroll(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-1 bg-transparent">
      <div
        className="h-1 bg-yellow-400 transition-all duration-150"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
}