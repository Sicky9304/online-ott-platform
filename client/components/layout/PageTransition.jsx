'use client';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div key={pathname} className={`w-full min-h-screen ${isHome ? 'pt-0' : 'pt-14 sm:pt-16 md:pt-20'} transition-opacity duration-300`}>
      {children}
    </div>
  );
}
