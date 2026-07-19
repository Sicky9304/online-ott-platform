'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(5);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(5, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(100);
      }
    };

    // Trigger on route tab change
    setScrollProgress(15);
    const timer = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-2 bg-black/40 backdrop-blur-md pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_25px_rgba(6,182,212,1)]"
        style={{ width: `${scrollProgress}%` }}
        transition={{ ease: 'easeOut', duration: 0.15 }}
      />
    </div>
  );
}
